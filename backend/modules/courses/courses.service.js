const Course = require('./courses.schema')

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
  return await Course.findByIdAndDelete(id)
}

const getLatestCourses = async() => {
    return await Course.find()
        .populate('teacher', '-password -__v')
        .sort({ createdAt: -1 })
        .limit(6)
}

const searchCourses = async ({ q, category, page, limit }) => {
    const filter = {}

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

    return { courses, totalResults }
}

const getCourseWithContent = async (id) => {
    return await Course.findById(id)
        .populate('teacher', '-password -__v')
        .populate({
            path: 'modules',
            populate: {
                path: 'lessons',
                select: 'name description module'
            }
        })
}

const getMyCourses = async (teacherId) => {
    return await Course.find({ teacher: teacherId })
        .populate('teacher', '-password -__v')
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
    getCourseForLearning
}