const Business = require('../models/Business');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up Multer Storage Engine locally
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        // Format: businessName-timestamp.ext
        const ext = path.extname(file.originalname);
        const businessName = req.body.businessName ? req.body.businessName.replace(/\\s+/g, '-').toLowerCase() : 'business';
        cb(null, `${businessName}-${Date.now()}${ext}`);
    }
});

// Configure file upload filters
const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Images only (jpeg, jpg, png)!'));
        }
    }
});


// @desc    Register a new business with uploaded photos
// @route   POST /api/business
// @access  Public (for demo purposes)
const registerBusiness = async (req, res) => {
    try {
        const { businessName, location } = req.body;

        if (!businessName || !location) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Get file paths
        const photoPaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Save to Database
        const newBusiness = await Business.create({
            businessName,
            location,
            photos: photoPaths
            // user: req.user._id // if relying on auth middleware later
        });

        res.status(201).json({
            success: true,
            data: newBusiness
        });
    } catch (error) {
        console.error("Error registering business:", error);
        res.status(500).json({ success: false, message: 'Server Error registering business' });
    }
};

module.exports = {
    registerBusiness,
    upload
};
