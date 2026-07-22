const HttpException = require('../index')

class LessonNotFoundException extends HttpException {
    constructor (
        message = 'The requested lesson is not found',
        error = 'Not found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = LessonNotFoundException