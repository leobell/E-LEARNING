const Module = require('./module.schema')
const Course = require('../courses/courses.schema')

const createModule = async(idCourse, name) => {
    const course = await Course.findById(idCourse)

    const newModule = new Module({ name, course: idCourse })
    const saveModule = await newModule.save()

    course.modules.push(saveModule._id)
    await course.save()

    return saveModule
}

const getModulesByCourse = async (courseId) => {
  return await Module.find({ course: courseId })
}

const getModuleById = async (id) => {
    return await Module.findById(id)
}

const updateModule = async(id, data) => {
    return await Module.findByIdAndUpdate(id, data, {
        returnDocument: 'after', 
        runValidators: true 
    })
}

const deleteModule = async(id) => {
    const deleteModule = await Module.findByIdAndDelete(id)
    await Course.findByIdAndUpdate(deleteModule.course, { $pull: { modules: id }})
    return deleteModule
}

module.exports = {
    createModule,
    getModuleById,
    getModulesByCourse,
    updateModule,
    deleteModule
}