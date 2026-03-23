const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    authorName: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: String, // Clerk User ID (Optional bindings later)
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
