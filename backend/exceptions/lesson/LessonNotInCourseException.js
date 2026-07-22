const HttpException = require('../index')

class LessonNotInCourseException extends HttpException {
    constructor (
        message = 'This lesson does not belong to the specified course.',
        error = 'Bad Request',
        statusCode = 400
    ) {
        super(message, error, statusCode)
    }
}

module.exports = LessonNotInCourseException