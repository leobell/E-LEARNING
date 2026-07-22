const mongoose = require('mongoose')

const moduleSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lessons: [
        { type: mongoose.Schema.Types.ObjectId, 
            ref: 'Lesson' 
        }
    ]
}, { timestamps: true, strict: true })


module.exports = mongoose.model('Module', moduleSchema)