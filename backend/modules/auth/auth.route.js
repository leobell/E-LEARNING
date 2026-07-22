const express = require('express')
const auth = express.Router()
const authController = require('./auth.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')

auth.post('/login', authController.login)
auth.patch('/change-password', verifyToken, authController.changePassword)


module.exports = auth