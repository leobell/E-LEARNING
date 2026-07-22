const HttpException = require('../index')

class UserNotAllowedException extends HttpException {
    constructor (
        message = 'You are not authorized to perform this operation.',
        error = 'Forbidden',
        statusCode = 403
    ) {
        super(message, error, statusCode)
    }
}

module.exports = UserNotAllowedException