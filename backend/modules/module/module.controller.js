const moduleService = require('./module.service')
const courseService = require('../courses/courses.service')
const CourseNotFoundException = require('../../exceptions/course/CourseNotFoundException')
const ModuleNotFoundException = require('../../exceptions/module/ModuleNotFoundException')
const UserNotAllowedException = require('../../exceptions/restrictionUserRole/UserNotAllowedException')

const createModule = async(req, res, next) => {
    try {
        const { courseId } = req.params
        const { name } = req.body
        
        const course = await courseService.getOneCourse(courseId)

        if (!course) {
            throw new CourseNotFoundException()
        }

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const newModule = await moduleService.createModule(courseId, name)

        res.status(201)
            .json({
                statusCode: 201,
                message: 'Module created successfully',
                newModule
            })
    } catch (e) {
        next(e)
    }
}

const getModulesByCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params
        const modules = await moduleService.getModulesByCourse(courseId)

        res.status(200)
            .json({
                statusCode:200,
                modules 
            })
    } catch (e) {
        next(e)
    }
}

const getModuleById = async (req, res, next) => {
    try {
        const { id } = req.params
        const singleModule = await moduleService.getModuleById(id)

        if(!singleModule){
            throw new ModuleNotFoundException()
        }

        res.status(200)
            .json({ 
                statusCode:200,
                singleModule
            })
    } catch (e) {
        next(e)
    }
}

const updateModule = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name } = req.body

        const existingModule = await moduleService.getModuleById(id)

        if (!existingModule) {
            throw new ModuleNotFoundException()
        }

        const course = await courseService.getOneCourse(existingModule.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const updatedModule = await moduleService.updateModule(id, { name })

        res.status(200)
            .json({
                statusCode:200,
                message: 'Module updated successfully',
                updatedModule
            })
    } catch (e) {
        next(e)
    }
}

const deleteModule = async (req, res, next) => {
    try {
        const { id } = req.params

        const existingModule = await moduleService.getModuleById(id)

        if (!existingModule) {
            throw new ModuleNotFoundException()
        }

        const course = await courseService.getOneCourse(existingModule.course)

        if (course.teacher._id.toString() !== req.user.id && req.user.role !== 'admin') {
            throw new UserNotAllowedException()
        }

        const deletedModule = await moduleService.deleteModule(id)

        res.status(200).json({
            statusCode:200,
            message:'Module deleted succesfully',
            deletedModule
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    createModule,
    getModulesByCourse,
    getModuleById,
    updateModule,
    deleteModule
}