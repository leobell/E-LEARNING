const Progress = require('./progress.schema')
const Lesson = require('../lessons/lessons.schema')
const Course = require('../courses/courses.schema')
const attachRatings = require('../../utils/attachRatings')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const AlreadyEnrolledException = require('../../exceptions/progress/AlreadyEnrolledException')
const LessonNotFoundException = require('../../exceptions/lesson/LessonNotFoundException')
const LessonNotInCourseException = require('../../exceptions/lesson/LessonNotInCourseException')
const NotEnrolledException = require('../../exceptions/progress/NotEnrolledException')
const InvalidAccessCodeException = require('../../exceptions/course/InvalidAccessCodeException')


const enrollStudent = async(courseId, studentId, accessCode) => {
    const course = await Course.findById(courseId)
    if(!course){
        throw new CourseNotFoundException()
    }

    if(course.isPrivate){
        if(!accessCode || accessCode.toUpperCase() !== course.accessCode){
            throw new InvalidAccessCodeException()
        }
    }

    try {
        return await Progress.create({ course: courseId, student: studentId })
    } catch (e) {
        if (e.code === 11000) {
            throw new AlreadyEnrolledException()
        }
        throw e
    }
}

const completeLesson = async (courseId, lessonId, studentId) => {
    const lesson = await Lesson.findById(lessonId)

    if (!lesson) {
        throw new LessonNotFoundException()
    }

    if (lesson.course.toString() !== courseId) {
        throw new LessonNotInCourseException()
    }

    const progress = await Progress.findOneAndUpdate(
        { course: courseId, student: studentId },
        {
            $addToSet: { completedLessons: lessonId },
            $set: { lastAccessedLesson: lessonId }
        },
        { new: true }
    )

    if (!progress) {
        throw new NotEnrolledException()
    }

    return progress
}

const getProgress = async (courseId, studentId) => {
    return await Progress.findOne({ course: courseId, student: studentId })
        .populate('completedLessons')
        .populate('lastAccessedLesson')
}

const getAllProgressByStudent = async (studentId) => {
    const progressList = await Progress.find({ student: studentId })
        .populate({
            path: 'course',
            populate: {
                path: 'modules',
                populate: {
                    path: 'lessons',
                    select: 'name'
                }
            }
        })
        .populate('lastAccessedLesson')
        .sort({ updatedAt: -1 })

    const courses = progressList.map((p) => p.course)
    const coursesWithRatings = await attachRatings(courses)

    return progressList.map((p, index) => ({
        ...p.toObject(),
        course: coursesWithRatings[index]
    }))
}

const unenrollFromCourse = async (courseId, studentId) => {
    const deleted = await Progress.findOneAndDelete({ course: courseId, student: studentId })

    if (!deleted) {
        throw new NotEnrolledException()
    }

    return deleted
}

module.exports = {
    enrollStudent,
    completeLesson,
    getProgress,
    getAllProgressByStudent,
    unenrollFromCourse
}
