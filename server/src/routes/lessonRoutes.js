import express from 'express';
const router = express.Router();
import { getLessonVideo, verifyQuizAndComplete, getProgress, getQuiz, setUserLanguage } from '../controllers/lessonController.js';

// Define specific routes
router.get('/progress', getProgress);
router.post('/language', setUserLanguage);
router.get('/:level/:stage', getLessonVideo);
router.get('/:level/:stage/quiz', getQuiz);
router.post('/:level/:stage/complete', verifyQuizAndComplete);

export default router;
