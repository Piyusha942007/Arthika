const mongoose = require('mongoose');

const shgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        index: true // Indexing for faster location-based queries
    },
    focusArea: {
        type: String,
        required: true,
        trim: true
    },
    membersCount: {
        type: Number,
        default: 1
    },
    contactPhone: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SHG', shgSchema);
