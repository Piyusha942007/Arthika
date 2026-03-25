import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: String, // e.g., Clerk Auth ID
        required: true,
        unique: true
    },
    highestUnlockedLevel: {
        type: Number,
        default: 1
    },
    highestUnlockedStage: {
        type: Number,
        default: 1
    },
    languagePreference: {
        type: String,
        enum: ['english', 'hindi', 'marathi'],
        default: 'english'
    },
    coins: {
        type: Number,
        default: 0
    },
    stageAttempts: [{
        level: Number,
        stage: Number,
        attempts: { type: Number, default: 0 },
        firstTryCorrect: { type: Number, default: 0 }, // Number of correct answers on first try
        isCompleted: { type: Number, default: 0 } // 0 or 1
    }]
}, { timestamps: true });

export default mongoose.model('UserProgress', userProgressSchema);
