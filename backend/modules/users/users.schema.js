const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId
      },
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'teacher', 'admin']
    }
}, { timestamps: true })

userSchema.pre('save', async function() {
    const instance = this

    if(!instance.isModified('password')){
        return
    }
    
    const salt = await bcrypt.genSalt(10)
    instance.password = await bcrypt.hash(instance.password, salt)
})

userSchema.pre('findOneAndUpdate', async function() {
    const update = this.getUpdate()

    if(update.password){
        const salt = await bcrypt.genSalt(10)
        const hashed = await bcrypt.hash(update.password, salt)

        update.password = hashed
    }
})

module.exports = mongoose.model('User', userSchema)