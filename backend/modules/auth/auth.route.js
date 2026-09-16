const express = require('express')
const auth = express.Router()
const authController = require('./auth.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { authLimiter } = require('../../middlewares/rateLimiter/rateLimiter')

auth.post('/login', authLimiter, authController.login)
auth.post('/auth/google', authController.googleAuth)
auth.post('/auth/google/complete', authController.completeGoogleRegistration)

auth.post('/auth/forgot-password', authLimiter, authController.requestPasswordReset)
auth.post('/auth/reset-password', authLimiter, authController.resetPassword)

auth.patch('/auth/change-password', verifyToken, authController.changePassword)

module.exports = auth