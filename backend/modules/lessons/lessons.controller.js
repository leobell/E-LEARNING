const lessonService = require('./lessons.service')
const moduleService = require('../module/module.service')
const courseService = require('../courses/courses.service')
const { uploadVideoToCloudinary, deleteVideoFromCloudinary } = require('./lessons.upload')
const LessonNotFoundException = require('../../exceptions/lesson/LessonNotFoundException')
const ModuleNotFoundException = require('../../exceptions/module/ModuleNotFoundException')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const UserNotAllowedException = require('../../exceptions/restrictionUserRole/UserNotAllowedException')
const MissingFileException = require('../../exceptions/upload/MissingFileException')

const createLesson = async (req, res, next) => {
    try {
        const { moduleId } = req.params
        const { name, linkVideo, description } = req.body

        const existingModule = await moduleService.getModuleById(moduleId)
        if (!existingModule) {
            throw new ModuleNotFoundException()
        }

        const course = await courseService.getOneCourse(existingModule.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const newLesson = await lessonService.createLesson(moduleId, course._id, { name, linkVideo, description })

        res.status(201)
            .json({
                statusCode: 201,
                message: 'Lesson created successfully',
                newLesson
            })
    } catch (e) {
        next(e)
    }
}


const getLessonsByModule = async (req, res, next) => {
    try {
        const { moduleId } = req.params
        const lessons = await lessonService.getLessonsByModule(moduleId)

        res.status(200)
            .json({
                statusCode: 200,
                lessons
            })
    } catch (e) {
        next(e)
    }
}

const getLessonById = async (req, res, next) => {
    try {
        const { id } = req.params
        const lesson = await lessonService.getLessonById(id)

        if (!lesson) {
            throw new LessonNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                lesson
            })
    } catch (e) {
        next(e)
    }
}

const updateLesson = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, linkVideo, description } = req.body

        const existingLesson = await lessonService.getLessonById(id)

        if (!existingLesson) {
            throw new LessonNotFoundException()
        }

        const existingModule = await moduleService.getModuleById(existingLesson.module)
        const course = await courseService.getOneCourse(existingModule.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const updatedLesson = await lessonService.updateLesson(id, { name, linkVideo, description })

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Lesson updated successfully',
                updatedLesson
            })
    } catch (e) {
        next(e)
    }
}

const deleteLesson = async (req, res, next) => {
    try {
        const { id } = req.params

        const existingLesson = await lessonService.getLessonById(id)

        if (!existingLesson) {
            throw new LessonNotFoundException()
        }

        const existingModule = await moduleService.getModuleById(existingLesson.module)
        const course = await courseService.getOneCourse(existingModule.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const deletedLesson = await lessonService.deleteLesson(id)

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Lesson deleted successfully',
                deletedLesson
            })
    } catch (e) {
        console.log(e)
        next(e)
    }
}

const uploadLessonVideo = async (req, res, next) => {
    try {
        const { id } = req.params
        
        const existingLesson = await lessonService.getLessonById(id)

        if(!existingLesson){
            throw new LessonNotFoundException()
        }
        
        const course = await courseService.getOneCourse(existingLesson.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        if (!req.file) {
            throw new MissingFileException()
        }
        
        if (existingLesson.videoPublicId) {
            await deleteVideoFromCloudinary(existingLesson.videoPublicId)
        }

        const result = await uploadVideoToCloudinary(req.file.buffer)
        
        const updatedLesson = await lessonService.updateLesson(id, {
            linkVideo: result.secure_url,
            videoPublicId: result.public_id
        })

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Lesson video uploaded successfully',
                updatedLesson
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createLesson,
    getLessonsByModule,
    getLessonById,
    updateLesson,
    deleteLesson,
    uploadLessonVideo
}
