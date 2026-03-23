const express = require('express');
const router = express.Router();
const { registerBusiness, getBusinesses, deleteBusiness, addComment, deleteComment, upload } = require('../controllers/businessController');

// Route: GET and POST /api/business
router.route('/')
    .get(getBusinesses)
    .post(upload.single('photo'), registerBusiness); // Using single()

router.route('/:id')
    .delete(deleteBusiness);

router.route('/:id/comments')
    .post(addComment);

router.route('/:id/comments/:commentId')
    .delete(deleteComment);

module.exports = router;
