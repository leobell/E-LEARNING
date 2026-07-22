const UserNotAllowedException = require('../../exceptions/restrictionUserRole/UserNotAllowedException')

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new UserNotAllowedException()
    }

    next()
  }
}

module.exports = { restrictTo }