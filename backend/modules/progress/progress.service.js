const Progress = require('./progress.schema')
const Lesson = require('../lessons/lessons.schema')
const Course = require('../courses/courses.schema')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const AlreadyEnrolledException = require('../../exceptions/progress/AlreadyEnrolledException')
const LessonNotFoundException = require('../../exceptions/lesson/LessonNotFoundException')
const LessonNotInCourseException = require('../../exceptions/lesson/LessonNotInCourseException')
const NotEnrolledException = require('../../exceptions/progress/NotEnrolledException')


const enrollStudent = async(courseId, studentId) => {
    const course = Course.findById(courseId)
    if(!course){
        throw new CourseNotFoundException()
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
    return await Progress.find({ student: studentId })
        .populate('course')
        .populate('lastAccessedLesson')
        .sort({ updatedAt: -1 })
}

module.exports = {
    enrollStudent,
    completeLesson,
    getProgress,
    getAllProgressByStudent
}
