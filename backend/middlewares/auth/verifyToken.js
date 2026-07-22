const jwt = require('jsonwebtoken')
const InvalidOrMissingTokenException = require('../../exceptions/auth/InvalidOrMissingTokenException')

const verifyToken = async(req, res, next) => {

    const authHeader = req.header('authorization')

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(new InvalidOrMissingTokenException())
    }

    const token = authHeader.split(' ')[1]
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (e) {
        next(new InvalidOrMissingTokenException())
    }
}

module.exports = {
    verifyToken
}