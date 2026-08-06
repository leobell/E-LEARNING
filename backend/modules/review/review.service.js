const Review = require('./review.schema')
const Progress = require('../progress/progress.schema')
const NotEnrolledException = require('../../exceptions/progress/NotEnrolledException')

const createReview = async (courseId, studentId, { rating, comment }) => {
    const isEnrolled = await Progress.exists({ course: courseId, student: studentId })
    if(!isEnrolled){
        throw new NotEnrolledException()
    }

    try {
        return await Review.create({ course: courseId, student: studentId, rating, comment })
    } catch (e) {
        if (e.code === 11000) {
            throw new AlreadyReviewedException()
        }
        throw e
    }
}

const getReviewsByCourse = async(courseId) => {
    return await Review.find({ course: courseId })
        .populate('student', 'firstName lastName')
        .sort({ createdAt: -1 })
}

const updateReview = async(id, studentId, { rating, comment }) => {
    const review = await Review.findOne({ _id: id, student:studentId })
    if (!review) {
        throw new ReviewNotFoundException()
    }

    review.rating = rating
    review.comment = comment

    return await review.save()
}

const deleteReview = async (id, studentId) => {
    const review = await Review.findOneAndDelete({ _id: id, student: studentId })
    if (!review) {
        throw new ReviewNotFoundException()
    }
    return review
}

module.exports = { 
    createReview, 
    getReviewsByCourse, 
    updateReview, 
    deleteReview 
}