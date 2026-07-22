const multer = require('multer')
const cloudinary = require('../../config/cloudinary')
const UnsupportedFileTypeException = require('../../exceptions/upload/UnsupportedFileTypeException')

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/quicktime', 'video/webm']

        if(allowedTypes.includes(file.mimetype)){
            cb(null, true)
        } else {
            cb(new UnsupportedFileTypeException(`Unsupported file type. Only ${allowedTypes.join(', ')} are allowed.`), false)
        }
    }
})

const uploadVideoToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'E-Learning-content/lessons', resource_type: 'video' },
            (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        )
        stream.end(fileBuffer)
    })
}

const deleteVideoFromCloudinary = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
}

module.exports = {
    upload,
    uploadVideoToCloudinary,
    deleteVideoFromCloudinary
}