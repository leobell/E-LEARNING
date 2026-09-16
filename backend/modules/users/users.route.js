const express = require('express')
const users = express.Router()
const userController = require('./users.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { authLimiter } = require('../../middlewares/rateLimiter/rateLimiter')

users.get('/users', verifyToken, userController.getAllUsers)

users.get('/users/me', verifyToken, userController.getMe)
users.get('/users/:id', verifyToken, userController.getUser)

users.post('/users/register', authLimiter, userController.createNewUser)

users.patch('/users/me', verifyToken, userController.updateUser)

users.delete('/users/:id', verifyToken, userController.deleteUser)

module.exports = users