const reviewService = require('./review.service')

const createReview = async(req, res, next) => {
    try {
        const { courseId } = req.params
        const { rating, comment } = req.body
        const studentId = req.user.id

        const newReview = await reviewService.createReview(courseId, studentId, { rating, comment })

        res.status(201)
            .json({
                statusCode: 201,
                message: 'Review created successfully',
                newReview
            })
    } catch (e) {
        next(e)
    }
}

const getReviewsByCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params
        const reviews = await reviewService.getReviewsByCourse(courseId)

        res.status(200).json({
            statusCode: 200,
            reviews
        })
    } catch (e) {
        next(e)
    }
}

const updateReview = async (req, res, next) => {
    try {
        const { id } = req.params
        const { rating, comment } = req.body
        const studentId = req.user.id

        const updatedReview = await reviewService.updateReview(id, studentId, { rating, comment })

        res.status(200).json({
            statusCode: 200,
            message: 'Review updated successfully',
            updatedReview
        })
    } catch (e) {
        next(e)
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params
        const studentId = req.user.id

        const deletedReview = await reviewService.deleteReview(id, studentId)

        res.status(200).json({
            statusCode: 200,
            message: 'Review deleted successfully',
            deletedReview
        })
    } catch (e) {
        next(e)
    }
}

module.exports = { 
    createReview, 
    getReviewsByCourse, 
    updateReview, 
    deleteReview 
}