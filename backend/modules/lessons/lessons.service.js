const Lesson = require('./lessons.schema')
const Module = require('../module/module.schema')

const createLesson = async (moduleId, courseId, { name, linkVideo, description }) => {
    const newLesson = new Lesson({ name, linkVideo, description, module: moduleId, course: courseId })
    const savedLesson = await newLesson.save()

    await Module.findByIdAndUpdate(moduleId, { $push: { lessons: savedLesson._id } })

    return savedLesson
}

const getLessonsByModule = async(moduleId) => {
    return await Lesson.find({ module: moduleId })
}

const getLessonById = async(id) => {
    return await Lesson.findById(id)
}

const updateLesson = async(id, body) =>{
    return await Lesson.findByIdAndUpdate(id, body, {
        returnDocument: 'after', 
        runValidators: true
    })
}

const deleteLesson = async (id) => {
    const deletedLesson = await Lesson.findByIdAndDelete(id)

    if (deletedLesson) {
        await Module.findByIdAndUpdate(deletedLesson.module, { $pull: { lessons: id } })
    }

    return deletedLesson
}

module.exports = {
    createLesson,
    getLessonsByModule,
    getLessonById,
    updateLesson,
    deleteLesson
}