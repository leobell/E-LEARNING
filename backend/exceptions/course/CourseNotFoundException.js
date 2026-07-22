const HttpException = require('../index')

class CourseNotFoundException extends HttpException {
    constructor (
        message = 'The requested course is not found',
        error = 'Not found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = CourseNotFoundException