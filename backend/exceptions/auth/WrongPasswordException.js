const HttpException = require('../index')

class WrongPasswordException extends HttpException {
    constructor (
        message = 'Current password is incorrect.',
        error = 'Unauthorized',
        statusCode = 401
    ) {
        super(message, error, statusCode)
    }
}

module.exports = WrongPasswordException
