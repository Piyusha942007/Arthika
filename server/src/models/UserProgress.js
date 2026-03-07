const mongoose = require('mongoose');

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
        enum: ['english', 'hindi'],
        default: 'english'
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
