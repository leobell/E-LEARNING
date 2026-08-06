const express = require('express')
const auth = express.Router()
const authController = require('./auth.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')

auth.post('/login', authController.login)
auth.post('/auth/google', authController.googleAuth)
auth.post('/auth/google/complete', authController.completeGoogleRegistration)

auth.post('/auth/forgot-password', authController.requestPasswordReset)
auth.post('/auth/reset-password', authController.resetPassword)

auth.patch('/auth/change-password', verifyToken, authController.changePassword)

module.exports = auth