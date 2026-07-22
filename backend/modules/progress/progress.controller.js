const progressService = require('./progress.service')
const ProgressNotFoundException = require('../../exceptions/progress/ProgressNotFoundException')

const enroll = async(req, res, next) => {
    try {
        const { courseId } = req.params
        const studentId = req.user.id

        const progress = await progressService.enrollStudent(courseId, studentId)

        res.status(201)
            .json({
                statusCode:201,
                message:'Enrolled succesfully',
                progress
            })
    } catch (e) {
        next(e)
    }
}

const completeLesson = async(req, res, next) => {
    try {
        const { courseId, lessonId } = req.params
        const studentId = req.user.id

        const progress = await progressService.completeLesson(courseId, lessonId, studentId)

        res.status(200)
            .json({
                statusCode:200,
                message:'Lesson marked as completed',
                progress
            })
    } catch (e) {
        next(e)
    }
}

const getProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params
        const studentId = req.user.id

        const progress = await progressService.getProgress(courseId, studentId)

        if (!progress) {
            throw new ProgressNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                progress
            })
    } catch (e) {
        next(e)
    }
}

const getAllProgressByStudent = async(req, res, next) => {
    try {
        const studentId = req.user.id

        const allProgress = await progressService.getAllProgressByStudent(studentId)

        res.status(200)
            .json({
                statusCode: 200,
                allProgress
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    enroll,
    completeLesson,
    getProgress,
    getAllProgressByStudent
}
