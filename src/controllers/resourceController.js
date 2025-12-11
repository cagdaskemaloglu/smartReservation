const Resource = require('../model/resourceModel');
const Reservation = require('../model/reservationModel');


// Yeni kaynak oluştur -- sadece Admin
const createResource = async (req, res) => {
    const { name, type, capacity, status } = req.body;

    const resourceExists = await Resource.findOne({ name });
    if (resourceExists) {
        return res.status(400).json({ message: 'Bu kaynak adı zaten mevcut.' });
    }

    const resource = await Resource.create({ name, type, capacity, status });

    if (resource) {
        res.status(201).json(resource);
    } else {
        res.status(400).json({ message: 'Geçersiz kaynak verisi' });
    }
};


//tüm kaynakları listeler
const getResources = async (req, res) => {
    const resources = await Resource.find({});
    res.json(resources);
};


//kaynak sil --sadece Admin
const deleteResource = async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (resource) {
        await Resource.deleteOne({ _id: resource._id });
        res.json({ message: 'Kaynak başarıyla silindi.' });
    } else {
        res.status(404).json({ message: 'Kaynak bulunamadı.' });
    }
};

//admin ise tüm rezervasyonları gör || kullanıcı ise sadece kendi rezervasyonlarını gör
const getReservations = async (req, res) => {
    // admin ise tüm rezervasyonları gör
    if (req.user.role === 'admin') {
        const reservations = await Reservation.find({})
            .populate('user', 'name email')   
            .populate('resource', 'name type'); 
        res.json(reservations);
    } else {
        //kullanıcı sadece kendi rezervasyonlarını gör
        const reservations = await Reservation.find({ user: req.user._id })
            .populate('resource', 'name type');
        res.json(reservations);
    }
};


//rezervasyon iptali
const cancelReservation = async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);

    if (reservation) {
        //admin veya rezervasyonu yapan kullanıcı iptal edebilir
        if (reservation.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            
            if (reservation.status === 'cancelled') {
                 return res.status(400).json({ message: 'Bu rezervasyon zaten iptal edilmiş' });
            }

            reservation.status = 'cancelled';
            await reservation.save();
            
            console.log(`[BİLDİRİM] Rezervasyon iptal edildi -- Rezervasyon ID: ${reservation._id} - Kullanıcı: ${req.user.name}`);
            
            res.json({ message: 'Rezervasyon iptal edildi' });
        } else {
            res.status(401).json({ message: 'Bu işlemi yapmaya yetkiniz yok' });
        }
    } else {
        res.status(404).json({ message: 'Rezervasyon bulunamadı' });
    }
};


//en çok rezerve edilen kaynaklar raporu
const getTopResourcesReport = async (req, res) => {
    //aktif rezervasyonları grupla ve her kaynaktan kaç tane olduğunu say
    const topResources = await Reservation.aggregate([
        { $match: { status: 'active' } }, //aktif rezervasyonlar
        { $group: {
            _id: '$resource', // resource alanına göre grupla
            count: { $sum: 1 } // count artır
        }},
        { $sort: { count: -1 } }, //çoktan aza doğru sırala
        { $limit: 5 } 
    ]);

    //resource idleri resourceModel üzerinden gerçek isimlerine çevir
    await Reservation.populate(topResources, { 
        path: '_id', 
        model: 'Resource', 
        select: 'name type' 
    });

    res.json({
        reportName: "En Çok Rezerve Edilen İlk 5 Kaynak",
        data: topResources
    });
};


//daily weekly rezervasyon sayı raporu
const getDailyWeeklyReport = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    //daily
    const dailyReservations = await Reservation.countDocuments({
        createdAt: { $gte: today }
    });

    //weekly
    const weeklyReservations = await Reservation.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
        reportName: "Günlük ve Haftalık Aktivite Raporu",
        daily: dailyReservations,
        weekly: weeklyReservations
    });
};


//en çok rez yapan kullanıcılar
const getTopUsersReport = async (req, res) => {
    const topUsers = await Reservation.aggregate([
        { $match: { status: 'active' } },
        { $group: {
            _id: '$user',
            count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);
    await Reservation.populate(topUsers, {
        path: '_id',
        model: 'User',
        select: 'name email'
    });

    res.json({
        reportName: "En Çok Rezervasyon Yapan Kullanıcılar",
        data: topUsers
    });
};

module.exports = { 
    createResource, 
    getResources, 
    deleteResource, 
    getTopResourcesReport, 
    getDailyWeeklyReport, 
    getTopUsersReport 
};