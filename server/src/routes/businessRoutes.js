import express from 'express';
const router = express.Router();
import { registerBusiness, getBusinesses, deleteBusiness, addComment, deleteComment, upload } from '../controllers/businessController.js';

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

export default router;
