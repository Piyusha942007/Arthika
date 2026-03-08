const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.search
    .expression('resource_type:video AND folder:"Learn-Page(Hindi)/*"')
    .max_results(50)
    .execute()
    .then(res => console.log(res.resources.map(r => r.public_id)))
    .catch(err => console.error(err));
