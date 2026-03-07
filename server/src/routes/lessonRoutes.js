const express = require('express');
const router = express.Router();
const { getLessonVideo, verifyQuizAndComplete, getProgress, getQuiz, setUserLanguage } = require('../controllers/lessonController');

// Define specific routes
router.get('/progress', getProgress);
router.post('/language', setUserLanguage);
router.get('/:level/:stage', getLessonVideo);
router.get('/:level/:stage/quiz', getQuiz);
router.post('/:level/:stage/complete', verifyQuizAndComplete);

module.exports = router;
