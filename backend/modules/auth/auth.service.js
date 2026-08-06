const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../users/users.schema')
const { sendEmail } = require('../../config/mailer')
const { verifyGoogleToken } = require('../../config/googleAuth')
const InvalidPasswordException = require('../../exceptions/auth/InvalidPasswordException')
const WrongPasswordException = require('../../exceptions/auth/WrongPasswordException')
const InvalidOrExpiredTokenException = require('../../exceptions/auth/InvalidOrExpiredTokenException')

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
        firstName: user.firstName,
        lastName: user.lastName
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

const googleAuth = async(idToken) => {
    const payload = await verifyGoogleToken(idToken)

    const existingUser = await User.findOne({
        $or: [{ googleId: payload.sub }, { email: payload.email }]
    })

    if(existingUser) {
        if(!existingUser.googleId){
            existingUser.googleId = payload.sub
            await existingUser.save()
        }
        const token = jwt.sign({
            id: existingUser._id,
            role: existingUser.role,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName
        }, process.env.JWT_SECRET, { expiresIn: '7d' })

        return { isNewUser: false, token }
    }

    return {
        isNewUser: true,
        googleData: {
            googleId: payload.sub,
            email: payload.email,
            firstName: payload.given_name || '',
            lastName: payload.family_name || ''
        }
    }
}

const completeGoogleRegistration = async ({ googleId, email, firstName, lastName, role }) => {
    const allowedRoles = ['student', 'teacher']
    const finalRole = allowedRoles.includes(role) ? role : 'student'

    const newUser = new User({
        googleId, 
        firstName,
        lastName,
        email,
        role: finalRole
    })

    await newUser.save()

    const token = jwt.sign({
        id: newUser._id,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    return token
}

const requestPasswordReset = async(email) => {
    const user = await User.findOne({ email })
    if(!user) return

    const resetToken = crypto.randomBytes(32).toString('hex')

    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000
    await user.save()

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

    await sendEmail({
        to: user.email,
        subject: 'Reset della tua password',
        html: `
            <p>Hai richiesto di reimpostare la tua password.</p>
            <p><a href="${resetLink}">Clicca qui per impostare una nuova password</a></p>
            <p>Il link scade tra 1 ora. Se non hai richiesto tu il reset, ignora questa email.</p>
        `
    })
}

const resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user) {
        throw new InvalidOrExpiredTokenException()
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

}

module.exports = {
    login,
    changePassword,
    googleAuth, 
    completeGoogleRegistration,
    requestPasswordReset,
    resetPassword
}