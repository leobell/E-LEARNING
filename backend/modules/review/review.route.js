const express = require('express')
const review = express.Router()
const reviewController = require('./review.controller')
const { verifyToken } = require('../../middlewares/auth/verifyToken')
const { restrictTo } = require('../../middlewares/restrictedUserRoles/restrictTo')

review.post('/courses/:courseId/reviews', verifyToken, restrictTo('student'), reviewController.createReview)

review.get('/courses/:courseId/reviews', reviewController.getReviewsByCourse)

review.patch('/reviews/:id', verifyToken, restrictTo('student'), reviewController.updateReview)

review.delete('/reviews/:id', verifyToken, restrictTo('student'), reviewController.deleteReview)

module.exports = review