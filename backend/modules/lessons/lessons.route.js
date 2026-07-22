const express = require('express')
const lesson = express.Router()
const lessonController = require('./lessons.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { restrictTo } = require('../../middlewares/restrictedUserRoles/restrictTo')
const { upload } = require('./lessons.upload')

lesson.get('/modules/:moduleId/lessons', lessonController.getLessonsByModule)
lesson.get('/lessons/:id', lessonController.getLessonById)

lesson.post('/modules/:moduleId/lessons', verifyToken, restrictTo('teacher', 'admin'), lessonController.createLesson)
lesson.post('/lessons/:id/video', verifyToken, restrictTo('teacher', 'admin'), upload.single('video'), lessonController.uploadLessonVideo)

lesson.patch('/lessons/:id', verifyToken, restrictTo('teacher', 'admin'), lessonController.updateLesson)
lesson.delete('/lessons/:id', verifyToken, restrictTo('teacher', 'admin'), lessonController.deleteLesson)

module.exports = lesson