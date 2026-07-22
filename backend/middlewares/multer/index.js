const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()


const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
        const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm']

        if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Unsupported file type'), false)
        }
    }
})

module.exports = upload

