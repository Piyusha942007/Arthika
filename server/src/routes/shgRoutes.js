const express = require('express');
const router = express.Router();
const { getSHGs } = require('../controllers/shgController');

// Route: GET /api/shgs
// Query params: ?location=keyword
router.route('/').get(getSHGs);

module.exports = router;
