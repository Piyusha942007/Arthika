import express from 'express';
const router = express.Router();
import { registerBusiness, upload } from '../controllers/businessController.js';

// Route: POST /api/business
// Middleware: upload.array('photos', 5) allows up to 5 files under the 'photos' field
router.route('/')
    .post(upload.array('photos', 5), registerBusiness);

export default router;
