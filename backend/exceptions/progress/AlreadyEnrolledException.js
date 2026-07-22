const HttpException = require('../index')

class AlreadyEnrolledException extends HttpException {
    constructor (
        message = 'You are already enrolled in this course.',
        error = 'Conflict',
        statusCode = 409
    ) {
        super(message, error, statusCode)
    }
}

module.exports = AlreadyEnrolledException