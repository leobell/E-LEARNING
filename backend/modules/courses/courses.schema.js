const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    urlImg: {
        type: String,
        trim: true,
        default: 'https://res.cloudinary.com/dorh8oq6c/image/upload/v1784032641/Outstanding-h-Wallpapers_mcfj3t.png'
    },
    imagePublicId: { 
        type: String 
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['Programmazione', 'Design', 'Marketing', 'Business','Altro']
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    modules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        }  
    ]
}, { timestamps: true, strict: true })

module.exports = mongoose.model('Course', courseSchema)