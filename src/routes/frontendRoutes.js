const express = require('express');
const { getIndexPage, getLoginPage, getReportsPage } = require('../controllers/frontendController'); 
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); 

router.get('/', getIndexPage);

router.get('/login', getLoginPage);

router.get('/reports', getReportsPage);

module.exports = router;

