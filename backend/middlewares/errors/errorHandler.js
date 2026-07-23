const HttpException = require('../../exceptions/index')
const mongoose = require('mongoose')
const multer = require('multer')

const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409)
            .json({
                statusCode: 409,
                error: 'Conflict',
                message: 'Email already exists'
            })
    }

    if (err instanceof multer.MulterError) {
        return res.status(400)
            .json({
                statusCode: 400,
                error: 'Bad Request',
                message: err.code === 'LIMIT_FILE_SIZE'
                    ? 'File too large.'
                    : err.message
            })
    }

    if (err.name === 'TimeoutError' || err.http_code) {
        return res.status(504)
            .json({
                statusCode: 504,
                error: 'Gateway Timeout',
                message: 'Upload troppo lento o file troppo grande. Riprova con un file più leggero.'
            })
    }

    if (err instanceof HttpException) {
        return res.status(err.statusCode)
            .json({
                statusCode: err.statusCode,
                message: err.message,
                error: err.error
            })
    }

    if (err instanceof mongoose.Error.CastError) {
        return res.status(400)
            .json({
                statusCode: 400,
                message: 'Mongoose error: object ID is invalid or malformed'
            })
    }

    if (err instanceof mongoose.Error.ValidationError) {
        const firstMessage = Object.values(err.errors)[0].message
        return res.status(400)
            .json({
                statusCode: 400,
                error: 'Bad Request',
                message: firstMessage
            })
    }

    res.status(500)
        .json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'Something went wrong on the server'
        })
}

module.exports = errorHandler