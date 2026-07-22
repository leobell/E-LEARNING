const HttpException = require('../index')

class ProgressNotFoundException extends HttpException {
    constructor (
        message = 'Progress not found for this student and course.',
        error = 'Not Found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = ProgressNotFoundException