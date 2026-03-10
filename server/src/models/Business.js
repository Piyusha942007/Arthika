import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    photos: [{
        type: String, // Store the local file paths (e.g., '/uploads/filename.jpg')
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming a User model exists and they must be logged in to upload
    }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
