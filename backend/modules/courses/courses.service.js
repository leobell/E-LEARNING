const Course = require('./courses.schema')
const Progress = require('../progress/progress.schema')
const Module = require('../module/module.schema')
const Lesson = require('../lessons/lessons.schema')
const attachRatings = require('../../utils/attachRatings')
const cloudinary = require('../../config/cloudinary')
const UserNotAllowedException = require('../../exceptions/restrictionUserRole/UserNotAllowedException')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const crypto = require('crypto')

const getAllCourses = async () => {
    return await Course.find()
        .populate('teacher', '-password -__v')
}

const getOneCourse = async (id) => {
    return await Course.findById(id)
        .populate('teacher', '-password -__v')
}

const createCourse = async(body) => {
    const newCourse = new Course(body)
    return await newCourse.save()
}

const updateCourse = async (id, body) => {
    return await Course.findByIdAndUpdate(id, body, {
        returnDocument: 'after', 
        runValidators: true 
    })
}

const deleteCourse = async (id) => {
    const course = await Course.findById(id)
    if(!course) return null

    const modules = await Module.find({ course: id })
    const modulesIds = modules.map((m) => m._id)

    const lessons = await Lesson.find({ module: { $in: modulesIds } })
    const videoPublicIds = lessons
        .map((l) => l.videoPublicId)
        .filter(Boolean)
    
    await Promise.all(
        videoPublicIds.map((publicId) => cloudinary.uploader.destroy(publicId, { resource_type: 'video' }).catch(() => null))
    )

    if(course.imagePublicId){
        await cloudinary.uploader.destroy(course.imagePublicId, { resource_type: 'image' })
    }

    await Progress.deleteMany({ course: id })
    await Lesson.deleteMany({ module: { $in: modulesIds } })
    await Module.deleteMany({ course: id })
    const deletedCourse = await Course.findByIdAndDelete(id)

    return deletedCourse
}

const getLatestCourses = async() => {
    const courses = await Course.find({ isPublished: true, isPrivate: false })
        .populate('teacher', '-password -__v')
        .sort({ createdAt: -1 })
        .limit(6)

    return await attachRatings(courses)
}

const searchCourses = async ({ q, category, page, limit }) => {
    const filter = { isPublished: true, isPrivate: false }

    if(q){
        filter.$or = [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } }
        ]
    }

    if (category) {
        filter.category = category
    }

    const skip = (page - 1) * limit

    const [courses, totalResults] = await Promise.all([
        Course.find(filter)
            .populate('teacher', '-password -__v')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Course.countDocuments(filter)
    ])

    const coursesWithRatings = await attachRatings(courses)

    return { courses: coursesWithRatings, totalResults }
}

const getCourseWithContent = async (id) => {
    const course = await Course.findById(id)
        .populate('teacher', '-password -__v')
        .populate({
            path: 'modules',
            populate: {
                path: 'lessons',
                select: 'name description module'
            }
        })

    if (!course) return null

    const enrolledCount = await Progress.countDocuments({ course: id })
    
    return { course, enrolledCount }
}

const getMyCourses = async (teacherId) => {
    const courses = await Course.find({ teacher: teacherId })
        .populate('teacher', '-password -__v')
        .populate({
            path:'modules',
            populate:{
                path:'lessons',
                select:'name'
            }
        })
    
    const coursesWithEnrollment = await Promise.all(
        courses.map(async (course) => {
            const enrolledCount = await Progress.countDocuments({ course: course._id })
            return { ...course.toObject(), enrolledCount }
        })
    )

    return await attachRatings(coursesWithEnrollment)
}

const getCourseForLearning = async (id) => {
    return await Course.findById(id)
        .populate('teacher', '-password -__v')
        .populate({
            path: 'modules',
            populate: {
                path: 'lessons'
            }
        })
}

const togglePublish = async(id, teacherId) => {
    const course = await Course.findById(id)
    if(!course) return null

    if(course.teacher.toString() !== teacherId){
        throw new UserNotAllowedException()
    }

    course.isPublished = !course.isPublished
    return await course.save()
}

const togglePrivate = async(id, teacherId) => {
    const course = await Course.findById(id)
    if(!course) return null

    if(course.teacher.toString() !== teacherId){
        throw new UserNotAllowedException()
    }

    course.isPrivate = !course.isPrivate

    if (course.isPrivate && !course.accessCode){
        course.accessCode = crypto.randomBytes(4).toString('hex').toUpperCase()
    }

    return await course.save()
}

const findByAccessCode = async (accessCode) => {
    const course = await Course.findOne({ accessCode: accessCode.toUpperCase(), isPrivate: true })
    if (!course) {
        throw new CourseNotFoundException()
    }
    return course
}

module.exports = {
    getAllCourses,
    getOneCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getLatestCourses,
    searchCourses,
    getCourseWithContent,
    getMyCourses,
    getCourseForLearning,
    togglePublish,
    togglePrivate,
    findByAccessCode
}