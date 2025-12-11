const express = require('express');
const { createReservation, getReservations, cancelReservation, cleanupExpiredReservations } = require('../controllers/reservationController'); 
const { protect } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.route('/cleanup')
    .put(protect, cleanupExpiredReservations);

router.route('/')
    .post(protect, createReservation)
    .get(protect, getReservations); 

router.route('/:id/cancel').put(protect, cancelReservation);

module.exports = router;