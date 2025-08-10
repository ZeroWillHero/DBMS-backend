const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith('image/');
        return {
            folder: 'uploads',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
            resource_type: 'auto',
            ...(isImage && {
                transformation: [{ width: 800, height: 800, crop: 'limit' }]
            })
        };
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to use in routes
function uploadImageMiddleware(fieldName) {
    return (req, res, next) => {
        const singleUpload = upload.single(fieldName);
        singleUpload(req, res, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (req.file && req.file.path) {
                req.fileUrl = req.file.path;
            }
            next();
        });
    };
}

module.exports = uploadImageMiddleware;