const courseService = require('./courses.service')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const UserNotAllowedException = require('../../exceptions/restrictionUserRole/UserNotAllowedException')
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('./courses.upload')
const MissingFileException = require('../../exceptions/upload/MissingFileException')

const getAllCourses = async(req, res, next) => {
    try {
        const allCourses = await courseService.getAllCourses()

        res.status(200)
            .json({
                statusCode: 200,
                allCourses
            })
    } catch (e) {
        next(e)
    }
}

const getOneCourse = async(req, res, next) => {
    try {
        const { id } = req.params
        const course = await courseService.getOneCourse(id)

        if(!course){
            throw new CourseNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                course
            })
    } catch (e) {
        next(e)
    }
}

const createCourse = async(req, res, next) => {
    try {
        const { name, description, urlImg, category } = req.body

        const courseData = {
            name,
            description,
            urlImg,
            category,
            teacher: req.user.id
        }

        const newCourse = await courseService.createCourse(courseData)

        res.status(201)
            .json({
                statusCode: 201,
                message: 'Course created successfully',
                newCourse
            })
    } catch (e) {
        next(e)
    }
}

const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, description, urlImg, category } = req.body

        const existingCourse = await courseService.getOneCourse(id)

        if (!existingCourse) {
            throw new CourseNotFoundException()
        }

        if (existingCourse.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const courseUpdated = await courseService.updateCourse(id, { name, description, urlImg, category })

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Course updated successfully',
                courseUpdated
            })
    } catch (e) {
        next(e)
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const { id } = req.params

        const existingCourse = await courseService.getOneCourse(id)

        if (!existingCourse) {
            throw new CourseNotFoundException()
        }

        if (existingCourse.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const courseDeleted = await courseService.deleteCourse(id)

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Course deleted successfully',
                courseDeleted
            })
    } catch (e) {
        next(e)
    }
}

const uploadCourseImage = async(req, res, next) => {
    try {
        const { id } = req.params

        const existingCourse = await courseService.getOneCourse(id)

        if(!existingCourse){
            throw new CourseNotFoundException()
        }

        if (existingCourse.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        if (!req.file) {
            throw new MissingFileException() 
        }
        if (existingCourse.imagePublicId) {
            await deleteImageFromCloudinary(existingCourse.imagePublicId)
        }

        const result = await uploadImageToCloudinary(req.file.buffer)

        const updatedCourse = await courseService.updateCourse(id, {
            urlImg: result.secure_url,
            imagePublicId: result.public_id
        })

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Course image uploaded successfully',
                updatedCourse
            })
    } catch (e) {
        next(e)
    }
}

const getLatestCourses = async(req, res, next) => {
    try {
        const courses = await courseService.getLatestCourses()

        res.status(200)
            .json({
                statusCode: 200,
                courses
            })
    } catch (e) {
        next(e)
    }
}

const searchCourses = async (req, res, next) => {
    try {
        const { q, category, page } = req.query

        const currentPage = parseInt(page) || 1
        const limit = 12

        const { courses, totalResults } = await courseService.searchCourses({ q, category, page: currentPage, limit })

        res.status(200)
            .json({
                statusCode: 200,
                totalResults,
                totalPages: Math.ceil(totalResults / limit),
                currentPage,
                courses
            })

    } catch (e) {
        next(e)
    }
}

const getCourseWithContent = async (req, res, next) => {
    try {
        const { id } = req.params

        const result = await courseService.getCourseWithContent(id)

        if (!result) {
            throw new CourseNotFoundException()
        }

        const { course, enrolledCount } = result

        if (!course.isPublished) {
            const isOwner = req.user && course.teacher._id.toString() === req.user.id
            const isAdmin = req.user && req.user.role === 'admin'
            if (!isOwner && !isAdmin) {
                throw new CourseNotFoundException()
            }
        }

        res.status(200).json({
            statusCode: 200,
            course,
            enrolledCount
        })
    } catch (e) {
        next(e)
    }
}

const getMyCourses = async (req, res, next) => {
    try {
        const teacherId = req.user.id
        const courses = await courseService.getMyCourses(teacherId)

        res.status(200)
            .json({
                statusCode:200,
                courses
            })
    } catch (e) {
        next(e)
    }
}

const getCourseForLearning = async (req, res, next) => {
    try {
        const { id } = req.params
        const course = await courseService.getCourseForLearning(id)

        if (!course) {
            throw new CourseNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                course
            })
    } catch (e) {
        next(e)
    }
}

const togglePublish = async(req, res, next) => {
    try {
        const { id } = req.params
        const updatedCourse = await courseService.togglePublish(id, req.user.id)

        if(!updatedCourse){
            throw new CourseNotFoundException()
        }

        res.status(200).json({
            statusCode: 200,
            message: updatedCourse.isPublished ? 'Course published' : 'Course unpublished',
            updatedCourse
        })

    } catch (e) {
        next(e)
    }
}

module.exports = {
    getAllCourses,
    getOneCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadCourseImage,
    getLatestCourses, 
    searchCourses,
    getCourseWithContent,
    getMyCourses,
    getCourseForLearning,
    togglePublish
}