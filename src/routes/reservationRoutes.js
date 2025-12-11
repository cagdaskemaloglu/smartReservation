const express = require('express');
// Yeni cleanupExpiredReservations fonksiyonunu import edin
const { createReservation, getReservations, cancelReservation, cleanupExpiredReservations } = require('../controllers/reservationController'); 
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

// YENİ ROTA: Süresi dolan rezervasyonları temizleme
// Frontend'deki runReservationCleanup() fonksiyonu bu rotayı PUT metoduyla çağırır.
// Bu işlem, sisteme giriş yapan her yetkili kullanıcı tarafından tetiklenebilir.
router.route('/cleanup')
    .put(protect, cleanupExpiredReservations);

// rezervasyon oluşturma ve listeleme
router.route('/')
    .post(protect, createReservation)
    .get(protect, getReservations); // listeleme

// rezervasyon iptali (PUT metoduyla durum güncellemesi)
router.route('/:id/cancel').put(protect, cancelReservation);

// NOT: Eğer iptal işlemi için ayrı bir rota yerine standart PUT /:id kullanmak isterseniz:
// router.route('/:id').put(protect, cancelReservation);
// Ancak mevcut yapınız (/:id/cancel) daha anlamlıdır.

module.exports = router;