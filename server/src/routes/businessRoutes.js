const express = require('express');
const router = express.Router();
const { registerBusiness, upload } = require('../controllers/businessController');

// Route: POST /api/business
// Middleware: upload.array('photos', 5) allows up to 5 files under the 'photos' field
router.route('/')
    .post(upload.array('photos', 5), registerBusiness);

module.exports = router;
