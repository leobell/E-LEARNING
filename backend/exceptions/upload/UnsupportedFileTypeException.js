const HttpException = require('../index')

class UnsupportedFileTypeException extends HttpException {
    constructor (
        message = 'Unsupported file type.',
        error = 'Bad Request',
        statusCode = 400
    ) {
        super(message, error, statusCode)
    }
}

module.exports = UnsupportedFileTypeException