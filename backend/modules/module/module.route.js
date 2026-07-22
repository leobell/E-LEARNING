const express = require('express')
const modules = express.Router()
const moduleController = require('./module.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { restrictTo } = require('../../middlewares/restrictedUserRoles/restrictTo')

modules.get('/courses/:courseId/modules', moduleController.getModulesByCourse)
modules.get('/modules/:id', moduleController.getModuleById)

modules.post('/courses/:courseId/modules', verifyToken, restrictTo('teacher', 'admin'), moduleController.createModule)

modules.patch('/modules/:id', verifyToken, restrictTo('teacher', 'admin'), moduleController.updateModule)

modules.delete('/modules/:id', verifyToken, restrictTo('teacher', 'admin'), moduleController.deleteModule)

module.exports = modules