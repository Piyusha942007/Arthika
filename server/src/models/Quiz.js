const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true
    },
    stage: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true,
        default: 'english'
    },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String }],
        correctOptionIndex: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
