const HttpException = require('../index')

class MissingFileException extends HttpException {
    constructor (
        message = 'No file was provided for upload.',
        error = 'Bad Request',
        statusCode = 400
    ) {
        super(message, error, statusCode)
    }
}

module.exports = MissingFileException