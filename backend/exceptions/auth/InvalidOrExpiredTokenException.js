const HttpException = require('../index')

class InvalidOrExpiredTokenException extends HttpException {
    constructor (
        message = 'Reset link is invalid or has expired.',
        error = 'Bad Request',
        statusCode = 400
    ) {
        super(message, error, statusCode)
    }
}

module.exports = InvalidOrExpiredTokenException