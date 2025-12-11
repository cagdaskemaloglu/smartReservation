const express = require('express');
const { createReservation, getReservations, cancelReservation } = require('../controllers/reservationController'); 
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

//rezervasyon oluşturma ve listeleme
router.route('/')
    .post(protect, createReservation)
    .get(protect, getReservations); //listeleme

//rezervasyon iptali
router.route('/:id/cancel').put(protect, cancelReservation);

module.exports = router;