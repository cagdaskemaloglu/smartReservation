const Reservation = require('../model/reservationModel');
const { reservationEventEmitter, EVENTS } = require('../utils/eventEmitter'); //


// Yeni rezervasyon oluştur 
const createReservation = async (req, res) => {
    const { resourceId, startTime, endTime } = req.body;
    const userId = req.user._id; // token dan gelen kullanıcı ID

    const start = new Date(startTime);
    const end = new Date(endTime);

    //Girilen tarihler uyumlu mu
    if (start >= end) {
        return res.status(400).json({ message: 'Başlangıç zamanı, bitiş zamanından önce olmalıdır.' });
    }

    //çakışma kontrolü algoritması
    const conflictingReservation = await Reservation.findOne({
        resource: resourceId, //çakışma aranacak kaynak
        status: 'active',      //aktif rezervasyonlarla karşılaştır
        //Tarih-saat çakışma kontrolü
        $or: [
             { startTime: { $lt: end }, endTime: { $gt: start } },
        ]
    });


    if (conflictingReservation) {
        return res.status(400).json({ 
            message: 'Bu kaynak, belirtilen saat aralığında doludur -- Rezervasyon çakışması!' 
        });
    }

    //rezervasyonu Oluştur
    const reservation = await Reservation.create({
        user: userId,
        resource: resourceId,
        startTime: start,
        endTime: end,
        status: 'active'
    });

    reservationEventEmitter.emit(EVENTS.RESERVATION_CREATED, {
        resourceName: reservation.resource.name,
        userName: req.user.name,
        userEmail: req.user.email,
        startTime: reservation.startTime,
        endTime: reservation.endTime
    });

    res.status(201).json(reservation);
};


//tüm rezervasyonları listele (Admin) veya kullanıcının kendi rezervasyonlarını listele (User)
const getReservations = async (req, res) => {
    // Admin ise tüm rezervasyonları listele
    if (req.user.role === 'admin') {
        const reservations = await Reservation.find({})
            .populate('user', 'name email')   
            .populate('resource', 'name type');
        res.json(reservations);
    } else {
        // Normal kullanıcı ise sadece kendi rezervasyonlarını listele
        const reservations = await Reservation.find({ user: req.user._id })
            .populate('resource', 'name type');
        res.json(reservations);
    }
};

//rezervasyon iptali (User veya Admin)
const cancelReservation = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        //admin veya rezervasyonu yapan kullanıcı iptal edebilir
        if (reservation.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            
            if (reservation.status === 'cancelled') {
                 return res.status(400).json({ message: 'Bu rezervasyon zaten iptal edilmiş.' });
            }

            reservation.status = 'cancelled';
            await reservation.save();
            
            console.log(`[BİLDİRİM] Rezervasyon iptal edildi -- Rezervasyon ID: ${reservation._id} Kullanıcı: ${req.user.name}`);
            
            reservationEventEmitter.emit(EVENTS.RESERVATION_CANCELLED, {
                _id: reservation._id,
                userName: req.user.name 
            });

            res.json({ message: 'Rezervasyon iptal edildi!' });
        } else {
            res.status(401).json({ message: 'Bu işlemi yapmaya yetkiniz yok' });
        }
    } else {
        res.status(404).json({ message: 'Rezervasyon bulunamadı' });
    }
};

module.exports = { createReservation, getReservations, cancelReservation }; // Export edin

