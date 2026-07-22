const multer = require('multer')
const cloudinary = require('../../config/cloudinary')
const UnsupportedFileTypeException = require('../../exceptions/upload/UnsupportedFileTypeException')

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new UnsupportedFileTypeException(`Unsupported file type. Only ${allowedTypes.join(', ')} are allowed.`), false)
        }
    }
})

const uploadImageToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'E-Learning-content/courses', resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        stream.end(fileBuffer)
    })
}

const deleteImageFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}

module.exports = {
    upload,
    uploadImageToCloudinary,
    deleteImageFromCloudinary
}
