const HttpException = require('../index')

class InvalidAccessCodeException extends HttpException {
    constructor (
        message = 'Invalid or missing access code.',
        error = 'Forbidden',
        statusCode = 403
    ) {
        super(message, error, statusCode)
    }
}

module.exports = InvalidAccessCodeException