const HttpException = require('../index')

class NotEnrolledException extends HttpException {
    constructor (
        message = 'You are not enrolled in this course.',
        error = 'Forbidden',
        statusCode = 403
    ) {
        super(message, error, statusCode)
    }
}

module.exports = NotEnrolledException