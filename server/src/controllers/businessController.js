import Business from '../models/Business.js';
import multer from 'multer';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'arthika_community',
        allowed_formats: ['jpeg', 'jpg', 'png']
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }
});

// @desc    Register a new business with single uploaded photo
// @route   POST /api/business
const registerBusiness = async (req, res) => {
    try {
        const { businessName, ownerName, clerkId, contact, location, category, description } = req.body;

        if (!businessName || !clerkId || !contact) {
            return res.status(400).json({ success: false, message: 'Missing required fields (businessName, clerkId, contact)' });
        }

        const imageUrl = req.file ? req.file.path : '';

        const newBusiness = await Business.create({
            businessName,
            ownerName,
            clerkId,
            contact,
            location,
            category,
            description,
            imageUrl
        });

        res.status(201).json({ success: true, data: newBusiness });
    } catch (error) {
        console.error("Error registering business:", error);
        res.status(500).json({ success: false, message: 'Server Error registering business' });
    }
};

// @desc    Get all businesses
// @route   GET /api/business
const getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: businesses.length, data: businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error fetching businesses' });
    }
};

// @desc    Delete a business explicitly mapped to logged-in user
// @route   DELETE /api/business/:id
const deleteBusiness = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const business = await Business.findById(req.params.id);

        if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

        // Ensure user owns the post
        if (business.clerkId !== clerkId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await Business.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Business removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error deleting business' });
    }
};

// @desc    Add a sub-document comment
// @route   POST /api/business/:id/comments
const addComment = async (req, res) => {
    try {
        const { clerkId, userName, userImage, text } = req.body;
        if (!text) return res.status(400).json({ success: false, message: 'Comment text required' });

        const business = await Business.findByIdAndUpdate(
            req.params.id,
            {
                $push: { comments: { clerkId, userName, userImage, text } }
            },
            { new: true, runValidators: true }
        );

        if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

        res.status(201).json({ success: true, data: business });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error adding comment' });
    }
};

// @desc    Delete a sub-document comment
// @route   DELETE /api/business/:id/comments/:commentId
const deleteComment = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const business = await Business.findById(req.params.id);

        if (!business) return res.status(404).json({ success: false, message: 'Business not found' });

        const comment = business.comments.find(c => c._id.toString() === req.params.commentId);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

        // Ensure user owns the comment
        if (comment.clerkId !== clerkId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        // Pull comment
        business.comments = business.comments.filter(c => c._id.toString() !== req.params.commentId);
        await business.save();

        res.status(200).json({ success: true, data: business });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error deleting comment' });
    }
};

export {
    registerBusiness,
    getBusinesses,
    deleteBusiness,
    addComment,
    deleteComment,
    upload
};
