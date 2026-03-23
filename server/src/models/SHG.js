import mongoose from 'mongoose';

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
        trim: true
    },
    membersCount: {
        type: Number,
        default: 1
    },
    contactPhone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('SHG', shgSchema);
