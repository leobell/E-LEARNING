const HttpException = require('../index')

class AlreadyReviewedException extends HttpException {
    constructor (
        message = 'You have already reviewed this course.',
        error = 'Conflict',
        statusCode = 409
    ) {
        super(message, error, statusCode)
    }
}

module.exports = AlreadyReviewedException