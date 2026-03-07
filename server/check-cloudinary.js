const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.resources({ type: 'upload', prefix: 'Learn-Page/' }, function (error, result) {
    if (error) {
        console.error("Cloudinary Error:", error);
    } else {
        console.log("Found Resources:");
        result.resources.forEach(res => {
            console.log(`Type: ${res.resource_type}, PublicId: ${res.public_id}, Format: ${res.format}, URL: ${res.secure_url}`);
        });
    }
});
