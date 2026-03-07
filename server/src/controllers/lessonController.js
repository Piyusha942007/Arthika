const cloudinary = require('cloudinary').v2;
const UserProgress = require('../models/UserProgress');
const Quiz = require('../models/Quiz');

// Cloudinary usually initialized in app.js or here. 
// Requires process.env variables.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getLessonVideo = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);

        // We assume Clerk middleware will attach the user to req.auth or similar
        // Fallback to headers for easy Postman testing if no middleware yet
        const userId = req.headers['x-user-id'] || 'test-user-id';

        let progress = await UserProgress.findOne({ userId });

        // If not found, create a blank record
        if (!progress) {
            progress = await UserProgress.create({ userId, highestUnlockedLevel: 1, highestUnlockedStage: 1 });
        }

        // Determine if user has access
        let isAllowed = false;
        if (level < progress.highestUnlockedLevel) {
            isAllowed = true;
        } else if (level === progress.highestUnlockedLevel && stage <= progress.highestUnlockedStage) {
            isAllowed = true;
        }

        if (!isAllowed) {
            return res.status(403).json({ message: 'Lesson locked. Complete previous stages to unlock.' });
        }

        // Find the video using Cloudinary Search API based on language preference (now defaulted to English)
        const folderPath = `Learn-Page/Level_${level}`;

        const searchResult = await cloudinary.search
            .expression(`resource_type:video AND folder:${folderPath} AND filename:Stage_${stage}*`)
            .max_results(1)
            .execute();

        if (!searchResult.resources || searchResult.resources.length === 0) {
            return res.status(404).json({ message: `Video for Level ${level}, Stage ${stage} not found.` });
        }

        // Use the secure_url returned directly from Cloudinary
        const videoUrl = searchResult.resources[0].secure_url;

        res.status(200).json({
            level,
            stage,
            videoUrl,
            isAllowed
        });
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ message: 'Error fetching lesson video' });
    }
};

const getQuiz = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);
        const userId = req.headers['x-user-id'] || 'test-user-id';

        let progress = await UserProgress.findOne({ userId });
        const language = 'english'; // Default to english since selection is removed

        // Fetch quiz for this level, stage, and language
        const quiz = await Quiz.findOne({ level, stage, language });

        if (!quiz) {
            // Provide a default fallback quiz if none exists in the DB yet, so the app doesn't break
            return res.status(200).json({
                questions: [
                    {
                        questionText: language === 'hindi' ? "डिफ़ॉल्ट प्रश्न: क्या आपने वीडियो देखा?" : "Fallback Quiz: Did you watch the video?",
                        options: language === 'hindi' ? ["हाँ", "नहीं"] : ["Yes", "No"],
                    }
                ]
            });
        }

        // Remove the correctOptionIndex before sending to the frontend to prevent cheating
        const safeQuestions = quiz.questions.map(q => ({
            questionText: q.questionText,
            options: q.options
        }));

        res.status(200).json({ questions: safeQuestions });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Error fetching quiz data' });
    }
};

const verifyQuizAndComplete = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);
        const userId = req.headers['x-user-id'] || 'test-user-id';
        const { userAnswers } = req.body; // Expecting an array of selected option indexes

        let progress = await UserProgress.findOne({ userId });
        const language = 'english'; // Default to english

        // Fetch quiz to check answers
        const quiz = await Quiz.findOne({ level, stage, language });

        let passed = true;

        if (quiz && userAnswers) {
            // Verify each answer
            for (let i = 0; i < quiz.questions.length; i++) {
                if (userAnswers[i] !== quiz.questions[i].correctOptionIndex) {
                    passed = false;
                    break;
                }
            }
        } else if (quiz && (!userAnswers || userAnswers.length !== quiz.questions.length)) {
            passed = false;
        } else {
            // If no quiz exists in DB yet, auto-pass for now (testing phase fallback based on the fake quiz above)
            if (userAnswers && userAnswers[0] !== 0) { // e.g. "Yes" is index 0
                passed = false;
            }
        }

        if (!passed) {
            return res.status(400).json({ message: 'Quiz failed. Try again!', passed: false });
        }

        // If passed, progress the user
        progress = await UserProgress.findOne({ userId });
        if (!progress) {
            progress = await UserProgress.create({ userId, highestUnlockedLevel: 1, highestUnlockedStage: 1, languagePreference: language });
        }

        // Only progress user if they are completing their *currently* highest allowed lesson
        // and haven't already surpassed it
        if (level === progress.highestUnlockedLevel && stage === progress.highestUnlockedStage) {
            if (stage < 3) {
                progress.highestUnlockedStage += 1;
            } else {
                if (progress.highestUnlockedLevel < 10) {
                    progress.highestUnlockedLevel += 1;
                    progress.highestUnlockedStage = 1;
                }
            }
            await progress.save();
        }

        res.status(200).json({
            message: 'Lesson and quiz completed successfully!',
            passed: true,
            highestUnlockedLevel: progress.highestUnlockedLevel,
            highestUnlockedStage: progress.highestUnlockedStage
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ message: 'Error saving progress' });
    }
};

const getProgress = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 'test-user-id';
        let progress = await UserProgress.findOne({ userId });

        if (!progress) {
            progress = await UserProgress.create({ userId, highestUnlockedLevel: 1, highestUnlockedStage: 1 });
        }

        // Example assumption: 10 levels, 3 stages each = 30 total videos
        const totalVideos = 30;

        // Calculate how many videos the user has completed.
        // Initially, progress is Level 1, Stage 1. This means NO completed quizzes/videos.
        // Once Stage 1 completes, it becomes Level 1, Stage 2 (which means 1 video is completed).
        const levelOffset = (progress.highestUnlockedLevel - 1) * 3;
        const stageOffset = progress.highestUnlockedStage - 1;
        const completedVideos = levelOffset + stageOffset;

        res.status(200).json({
            highestUnlockedLevel: progress.highestUnlockedLevel,
            highestUnlockedStage: progress.highestUnlockedStage,
            languagePreference: 'english',
            completedVideos,
            totalVideos
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Error fetching progress data' });
    }
};

const setUserLanguage = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 'test-user-id';
        const { language } = req.body;

        if (!['english', 'hindi'].includes(language)) {
            return res.status(400).json({ message: 'Invalid language preference' });
        }

        let progress = await UserProgress.findOne({ userId });

        if (!progress) {
            progress = await UserProgress.create({ userId, languagePreference: language, highestUnlockedLevel: 1, highestUnlockedStage: 1 });
        } else {
            progress.languagePreference = language;
            await progress.save();
        }

        res.status(200).json({ message: 'Language explicitly updated', languagePreference: language });
    } catch (error) {
        console.error('Error updating language:', error);
        res.status(500).json({ message: 'Error updating language configuration' });
    }
};

module.exports = {
    getLessonVideo,
    verifyQuizAndComplete,
    getQuiz,
    getProgress,
    setUserLanguage
};
