const HttpException = require('../index')

class ReviewNotFoundException extends HttpException {
    constructor (
        message = 'Review not found.',
        error = 'Not Found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = ReviewNotFoundException