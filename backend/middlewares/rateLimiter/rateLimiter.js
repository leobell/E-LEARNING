const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        statusCode: 429,
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.'
    }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        statusCode: 429,
        error: 'Too many requests',
        message: 'Too many login attemps, please try again later.'
    }
})

module.exports = {
    apiLimiter,
    authLimiter
}