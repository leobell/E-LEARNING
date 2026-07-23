const HttpException = require('../index')

class InvalidOrMissingTokenException extends HttpException {
    constructor(
        message = 'E-Learning: unauthorized!',
        error = 'Invalid or missing token detected.',
        statusCode = 401
    ) {
        super(message, error, statusCode)
    }
}

module.exports = InvalidOrMissingTokenException