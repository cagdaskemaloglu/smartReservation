const express = require('express');
const { createResource, getResources, deleteResource ,getTopResourcesReport , getDailyWeeklyReport, getTopUsersReport} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware'); 
const router = express.Router();

router.route('/')
    .get(protect, getResources) 
    .post(protect, admin, createResource); 

router.route('/:id').delete(protect, admin, deleteResource); 

//Sadece Admin erişebilir
router.route('/reports/top').get(protect, admin, getTopResourcesReport);
router.route('/reports/activity').get(protect, admin, getDailyWeeklyReport);
router.route('/reports/users').get(protect, admin, getTopUsersReport);

module.exports = router;

