const HttpException = require('../index')

class ModuleNotFoundException extends HttpException {
    constructor (
        message = 'The requested module is not found',
        error = 'Not found',
        statusCode = 404
    ) {
        super(message, error, statusCode)
    }
}

module.exports = ModuleNotFoundException