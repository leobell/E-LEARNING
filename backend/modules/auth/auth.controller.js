const authService = require('./auth.service')

const login = async(req, res, next) => {
    try {
        const { email, password } = req.body
        const { token } = await authService.login(email, password)

        res
            .header('authorization', `Bearer ${token}`)
            .status(200)
            .json({
                statusCode: 200,
                message: 'Login success!!',
                token
            })
    } catch (e) {
        next(e)
    }
}

const changePassword = async(req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body
        const userId = req.user.id
        
        await authService.changePassword(userId, currentPassword, newPassword)

        res.status(200)
            .json({
                statusCode: 200,
                message: 'Password changed successfully'
            })
    } catch (e) {
        next(e)
    }
}

const googleAuth = async(req, res, next) => {
    try {
        const { idToken } = req.body
        const result = await authService.googleAuth(idToken)

        res.status(200)
            .json({
                statusCode: 200,
                ...result
            })
    } catch (e) {
        next(e)
    }
}

const completeGoogleRegistration = async (req, res, next) => {
    try {
        const { googleId, email, firstName, lastName, role } = req.body
        const token = await authService.completeGoogleRegistration({ googleId, email, firstName, lastName, role })

        res.status(201).json({
            statusCode: 201,
            message: 'Registration completed',
            token
        })
    } catch (e) {
        next(e)
    }
}

const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body
        await authService.requestPasswordReset(email)

        res.status(200).json({
            statusCode: 200,
            message: 'If that email exists, a reset link has been sent'
        })
    } catch (e) {
        next(e)
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body
        await authService.resetPassword(token, newPassword)

        res.status(200).json({
            statusCode: 200,
            message: 'Password reset successfully'
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    login,
    changePassword,
    googleAuth,
    completeGoogleRegistration,
    requestPasswordReset,
    resetPassword
}