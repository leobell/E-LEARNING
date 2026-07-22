const HttpException = require('../index')

class InvalidPasswordException extends HttpException {
    constructor (
        message = 'E-Learning: Incorrect credential',
        error = 'The provided credential are not valid!! Please, try again.',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = InvalidPasswordException