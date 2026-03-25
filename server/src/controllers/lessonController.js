import { v2 as cloudinary } from 'cloudinary';
import UserProgress from '../models/UserProgress.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';

// Cloudinary usually initialized in app.js or here. 
// Requires process.env variables.
console.log("CLOUDINARY API KEY in Controller:", process.env.CLOUDINARY_API_KEY);
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getLessonVideo = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);

        // We assume Clerk middleware will attach the user to req.auth or similar
        // Fallback to headers for easy Postman testing if no middleware yet
        const userId = req.headers['x-user-id'] || 'test-user-id';

        let progress = await UserProgress.findOne({ userId });
        console.log("DEBUG: getLessonVideo progress for userId:", userId, progress ? { level: progress.highestUnlockedLevel, stage: progress.highestUnlockedStage } : "NOT FOUND");

        // If not found, create a blank record
        if (!progress) {
            console.log("DEBUG: Creating new progress for:", userId);
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

        // Find the video using Cloudinary Search API based on language preference
        const langQuery = req.query.lang || 'en';
        let languagePrefix = 'Learn-Page(English)';

        if (langQuery === 'hi') {
            languagePrefix = 'Learn-Page(Hindi)';
        } else if (langQuery === 'mr') {
            languagePrefix = 'Learn-Page(Marathi)';
        }

        const folderPath = `${languagePrefix}/Level_${level}`;
        console.log(`Cloudinary Search in folder="${folderPath}"`);

        // Try multiple naming patterns: "Stage_1" or "Level5_Stage1"
        const searchExpression = `resource_type:video AND folder:"${folderPath}" AND (filename:Stage_${stage}* OR filename:Level${level}_Stage${stage}*)`;
        
        let searchResult = await cloudinary.search
            .expression(searchExpression)
            .max_results(1)
            .execute();

        // FALLBACK: If not found, check if ANY videos exist in that folder to help debug naming
        if (!searchResult.resources || searchResult.resources.length === 0) {
            console.warn(`DEBUG: Specific search failed. Checking all files in ${folderPath}...`);
            const allFilesInFolder = await cloudinary.search
                .expression(`resource_type:video AND folder:"${folderPath}"`)
                .max_results(5)
                .execute();
            
            const existingFiles = allFilesInFolder.resources ? allFilesInFolder.resources.map(r => r.filename).join(', ') : 'None';
            console.log(`DEBUG: Files found in ${folderPath}: [${existingFiles}]`);

            return res.status(404).json({ 
                message: `Video not found with Stage_${stage}* pattern.`,
                details: `Search Path: ${folderPath}, Files found in folder: [${existingFiles}]`,
                level,
                stage
            });
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
        console.error('FULL ERROR:', error);
        res.status(500).json({ message: 'Error fetching lesson video', rawError: String(error), jsonError: JSON.stringify(error) });
    }
};

export const getQuiz = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);
        const userId = req.headers['x-user-id'] || 'test-user-id';

        let progress = await UserProgress.findOne({ userId });

        const langQuery = req.query.lang || 'en';
        let language = 'english';

        if (langQuery === 'hi') {
            language = 'hindi';
        } else if (langQuery === 'mr') {
            language = 'marathi';
        }

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

export const verifyQuizAndComplete = async (req, res) => {
    try {
        const level = parseInt(req.params.level, 10);
        const stage = parseInt(req.params.stage, 10);
        const userId = req.headers['x-user-id'] || 'test-user-id';
        const { userAnswers } = req.body; // Expecting an array of selected option indexes

        let progress = await UserProgress.findOne({ userId });

        const langQuery = req.query.lang || 'en';
        let language = 'english';

        if (langQuery === 'hi') {
            language = 'hindi';
        } else if (langQuery === 'mr') {
            language = 'marathi';
        }

        // Fetch quiz to check answers
        const quiz = await Quiz.findOne({ level, stage, language });

        let passed = true;
        let review = [];

        if (quiz && userAnswers) {
            // Verify each answer
            for (let i = 0; i < quiz.questions.length; i++) {
                const isCorrect = userAnswers[i] === quiz.questions[i].correctOptionIndex;
                if (!isCorrect) {
                    passed = false;
                }
                const correctText = quiz.questions[i].options[quiz.questions[i].correctOptionIndex];
                review.push({
                    questionText: quiz.questions[i].questionText,
                    userAnswer: userAnswers[i] !== null && userAnswers[i] !== undefined ? quiz.questions[i].options[userAnswers[i]] : 'None',
                    correctAnswer: correctText,
                    explanation: quiz.questions[i].explanation || `The correct answer is: ${correctText}`,
                    isCorrect: isCorrect
                });
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
            return res.status(400).json({ message: 'Quiz failed. Please check the explanations and try again!', passed: false, review });
        }

        // If passed, progress the user
        progress = await UserProgress.findOne({ userId });
        if (!progress) {
            progress = await UserProgress.create({ userId, highestUnlockedLevel: 1, highestUnlockedStage: 1, languagePreference: language });
        }

        // --- Coin Logic ---
        let coinsEarned = 0;
        let isFirstTry = false;

        // Find or create stage attempt record
        let attemptRecord = progress.stageAttempts.find(a => a.level === level && a.stage === stage);
        if (!attemptRecord) {
            isFirstTry = true;
            attemptRecord = { level, stage, attempts: 1, firstTryCorrect: 0, isCompleted: 1 };
            progress.stageAttempts.push(attemptRecord);
        } else {
            attemptRecord.attempts += 1;
            if (attemptRecord.isCompleted === 0) {
              attemptRecord.isCompleted = 1;
            }
        }

        // Calculate coins
        // Formula: 10 coins per correct answer on first try, 5 coins otherwise? 
        // User said: "points according to the correct answers in first try"
        // Let's do: 20 coins per correct answer if it's the first try and they PASS.
        // If they pass but not on first try, maybe 5 coins per correct answer?
        
        const correctCount = review.filter(r => r.isCorrect).length;
        
        if (isFirstTry) {
            attemptRecord.firstTryCorrect = correctCount;
            coinsEarned = correctCount * 20; // 20 coins per correct answer on first try
        } else {
            // If they already completed it, maybe no more coins? 
            // Or if they failed before and now passed, give some base coins.
            // Let's say if they failed before, they get 5 coins per correct answer now.
            // But if they ALREADY passed before, 0 coins.
            if (attemptRecord.attempts === 2 && attemptRecord.firstTryCorrect === 0) {
                coinsEarned = correctCount * 5; 
            }
        }

        progress.coins += coinsEarned;

        // Only progress user if they are completing their *currently* highest allowed lesson
        // and haven't already surpassed it
        let advanced = false;
        if (level === progress.highestUnlockedLevel && stage === progress.highestUnlockedStage) {
            if (stage < 3) {
                progress.highestUnlockedStage += 1;
            } else {
                if (progress.highestUnlockedLevel < 10) {
                    progress.highestUnlockedLevel += 1;
                    progress.highestUnlockedStage = 1;
                }
            }
            advanced = true;
        }

        await progress.save();

        res.status(200).json({
            message: 'Lesson and quiz completed successfully!',
            passed: true,
            highestUnlockedLevel: progress.highestUnlockedLevel,
            highestUnlockedStage: progress.highestUnlockedStage,
            coinsEarned,
            totalCoins: progress.coins,
            isFirstTry,
            review
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ message: 'Error saving progress' });
    }
};

export const getProgress = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 'test-user-id';
        let progress = await UserProgress.findOne({ userId });

        const langQuery = req.query.lang || 'en';
        let language = 'english';

        if (langQuery === 'hi') {
            language = 'hindi';
        } else if (langQuery === 'mr') {
            language = 'marathi';
        }

        if (!progress) {
            console.log("DEBUG: progress not found for userId:", userId, ". Creating new record.");
            progress = await UserProgress.create({ userId, highestUnlockedLevel: 1, highestUnlockedStage: 1, languagePreference: language });
        } else {
            console.log("DEBUG: Found progress for userId:", userId, progress);
        }

        // Diagnostic: Check User model too (optional but helpful for debugging)
        try {
            // Find user by Clerk ID? Wait, User model doesn't have clerkId, it has email.
            // But we don't have email here.
            // Wait, does the User model have the clerkId as 'password' or something? 
            // Usually Clerk users are synced to a local User model.
            console.log("DEBUG: userId from Clerk:", userId);
        } catch (uErr) {
            console.warn("DEBUG: Failed to check User model:", uErr.message);
        }

        // Example assumption: 10 levels, 3 stages each = 30 total videos
        const totalVideos = 30;

        // Calculate how many videos the user has completed.
        const levelOffset = (progress.highestUnlockedLevel - 1) * 3;
        const stageOffset = progress.highestUnlockedStage - 1;
        const completedVideos = levelOffset + stageOffset;

        // --- Legacy Coin Migration ---
        // If the user has completed videos but has 0 coins, they probably did them before the coin system.
        // Let's grant them 50 coins per completed video as a "loyalty bonus".
        if (completedVideos > 0 && progress.coins === 0) {
            progress.coins = completedVideos * 50; 
            // Mark them as completed in stageAttempts too if they aren't there
            for (let l = 1; l <= progress.highestUnlockedLevel; l++) {
              for (let s = 1; s <= 3; s++) {
                if (l < progress.highestUnlockedLevel || (l === progress.highestUnlockedLevel && s < progress.highestUnlockedStage)) {
                  if (!progress.stageAttempts.find(a => a.level === l && a.stage === s)) {
                    progress.stageAttempts.push({ level: l, stage: s, attempts: 1, firstTryCorrect: 3, isCompleted: 1 });
                  }
                }
              }
            }
            await progress.save();
        }

        res.status(200).json({
            highestUnlockedLevel: progress.highestUnlockedLevel,
            highestUnlockedStage: progress.highestUnlockedStage,
            languagePreference: progress.languagePreference || 'english',
            completedVideos,
            totalVideos,
            totalCoins: progress.coins || 0
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Error fetching progress data' });
    }
};

export const setUserLanguage = async (req, res) => {
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


