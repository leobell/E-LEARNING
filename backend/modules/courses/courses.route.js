const express = require('express')
const courses = express.Router()
const courseController = require('./courses.controller')
const { restrictTo } = require('../../middlewares/restrictedUserRoles/restrictTo')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { upload } = require('./courses.upload')

courses.get('/courses/latest', courseController.getLatestCourses)
courses.get('/courses/search', courseController.searchCourses)

courses.get('/courses', verifyToken, courseController.getAllCourses)
courses.get('/courses/mine', verifyToken, restrictTo('teacher', 'admin'), courseController.getMyCourses)
courses.get('/courses/:id', verifyToken, courseController.getOneCourse)
courses.get('/courses/:id/learn', verifyToken, courseController.getCourseForLearning)
courses.get('/courses/:id/content', courseController.getCourseWithContent)

courses.post('/courses', verifyToken, restrictTo('teacher', 'admin'), courseController.createCourse)
courses.post('/courses/:id/image', verifyToken, restrictTo('teacher', 'admin'), upload.single('image'), courseController.uploadCourseImage)

courses.patch('/courses/:id', verifyToken, restrictTo('teacher', 'admin'), courseController.updateCourse)
courses.delete('/courses/:id', verifyToken, restrictTo('teacher', 'admin'), courseController.deleteCourse)

module.exports = courses