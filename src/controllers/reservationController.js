const Reservation = require('../model/reservationModel');
const { reservationEventEmitter, EVENTS } = require('../utils/eventEmitter');
const asyncHandler = require('express-async-handler'); // Hata yakalama için Express-Async-Handler kullanılması önerilir

// YENİ: Geçmiş rezervasyonları temizleme fonksiyonu (cleanup)
// @desc    Süresi dolmuş aktif rezervasyonları iptal (cancelled) eder.
// @route   PUT /api/reservations/cleanup
// @access  Private
const cleanupExpiredReservations = asyncHandler(async (req, res) => {
    const now = new Date();

    // 2. Kriterlere uyan rezervasyonları toplu güncelleme (updateMany) ile iptal et
    const updateResult = await Reservation.updateMany(
        { 
            status: 'active',           
            endTime: { $lte: now }      
        },
        { 
            $set: { status: 'expired' } // SADECE BU KISIM DEĞİŞTİRİLDİ: 'expired'
        }
    );

    // 3. Kullanıcıya geri bildirim gönder
    if (updateResult.modifiedCount > 0) {
        // Konsola bilgi mesajı
        console.log(`[CLEANUP] ${updateResult.modifiedCount} adet süresi dolmuş rezervasyon iptal edildi.`);
        
        // Frontend'e kaç adet kayıt güncellendiğini gönder
        res.status(200).json({ 
            message: `${updateResult.modifiedCount} adet geçmiş rezervasyon temizlendi.`,
            count: updateResult.modifiedCount
        });
    } else {
        res.status(200).json({ 
            message: "İptal edilecek süresi dolmuş aktif rezervasyon bulunamadı.",
            count: 0
        });
    }
});


// Yeni rezervasyon oluştur 
// @route   POST /api/reservations
// @access  Private
const createReservation = asyncHandler(async (req, res) => {
    const { resourceId, startTime, endTime } = req.body;
    const userId = req.user._id; 

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Girilen tarihler uyumlu mu
    if (start >= end) {
        return res.status(400).json({ message: 'Başlangıç zamanı, bitiş zamanından önce olmalıdır.' });
    }
    
    // Geçmiş bir tarih için rezervasyon yapmayı engelle
    if (start < new Date()) {
        return res.status(400).json({ message: 'Geçmiş bir tarih ve saat için rezervasyon yapılamaz.' });
    }

    // çakışma kontrolü algoritması
    const conflictingReservation = await Reservation.findOne({
        resource: resourceId, 
        status: 'active',      
        // Tarih-saat çakışma kontrolü: Yeni rezervasyonun bitişi, mevcut aktif rezervasyonun başlangıcından büyükse, 
        // VE yeni rezervasyonun başlangıcı, mevcut aktif rezervasyonun bitişinden küçükse çakışma var demektir.
        $or: [
             { startTime: { $lt: end }, endTime: { $gt: start } },
        ]
    });


    if (conflictingReservation) {
        return res.status(400).json({ 
            message: 'Bu kaynak, belirtilen saat aralığında doludur -- Rezervasyon çakışması!' 
        });
    }

    // Rezervasyonu Oluştur
    let reservation = await Reservation.create({
        user: userId,
        resource: resourceId,
        startTime: start,
        endTime: end,
        status: 'active'
    });
    
    // Event fırlatmadan önce resource bilgilerini almak için popülasyon yap
    reservation = await reservation.populate('resource', 'name');


    reservationEventEmitter.emit(EVENTS.RESERVATION_CREATED, {
        resourceName: reservation.resource.name,
        userName: req.user.name,
        userEmail: req.user.email,
        startTime: reservation.startTime,
        endTime: reservation.endTime
    });

    res.status(201).json(reservation);
});


// tüm rezervasyonları listele (Admin) veya kullanıcının kendi rezervasyonlarını listele (User)
// @route   GET /api/reservations
// @access  Private
const getReservations = asyncHandler(async (req, res) => {
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
});

// rezervasyon iptali (User veya Admin)
// @route   PUT /api/reservations/:id
// @access  Private
const cancelReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        // admin veya rezervasyonu yapan kullanıcı iptal edebilir
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
});


module.exports = { 
    createReservation, 
    getReservations, 
    cancelReservation, 
    cleanupExpiredReservations // YENİ FONKSİYON
};