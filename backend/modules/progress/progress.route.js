const express = require('express')
const progress = express.Router()
const progressController = require('./progress.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { restrictTo } = require('../../middlewares/restrictedUserRoles/restrictTo')

progress.post('/courses/:courseId/enroll', verifyToken, restrictTo('student'), progressController.enroll)
progress.patch('/courses/:courseId/lessons/:lessonId/complete', verifyToken, restrictTo('student'), progressController.completeLesson)
progress.get('/courses/:courseId/progress', verifyToken, progressController.getProgress)
progress.get('/progress/me', verifyToken, restrictTo('student'), progressController.getAllProgressByStudent)

module.exports = progress
