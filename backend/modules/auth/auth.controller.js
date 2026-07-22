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

module.exports = {
    login,
    changePassword
}