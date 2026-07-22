const HttpException = require('../index')

class UserNotFoundException extends HttpException {
    constructor (
        message = 'the requested user is not found',
        error = 'Not found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = UserNotFoundException