const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../users/users.schema')
const InvalidPasswordException = require('../../exceptions/auth/InvalidPasswordException')
const WrongPasswordException = require('../../exceptions/auth/WrongPasswordException')

const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        throw new InvalidPasswordException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        throw new InvalidPasswordException()
    }

    const token = jwt.sign({
        id:user._id,
        role:user.role,
        firstName: user.firstName
    }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    return {
        token
    }
}

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password')
    
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
        throw new WrongPasswordException()
    }

    await User.findByIdAndUpdate(userId, { password: newPassword }, { runValidators: true })
}


module.exports = {
    login,
    changePassword
}