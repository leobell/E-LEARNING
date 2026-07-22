const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    linkVideo: { 
        type: String, 
        default:'' 
    },
    videoPublicId: { 
        type: String 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, { timestamps: true, strict: true })


module.exports = mongoose.model('Lesson', lessonSchema)