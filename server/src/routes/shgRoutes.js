import express from 'express';
const router = express.Router();
import { getSHGs } from '../controllers/shgController.js';

// Route: GET /api/shgs
// Query params: ?location=keyword
router.route('/').get(getSHGs);

export default router;
