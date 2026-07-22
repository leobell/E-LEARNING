const userService = require('./users.service')
const UserNotFoundException = require('../../exceptions/users/UserNotFoundException')

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUser()
        if(!users) {
            throw new UserNotFoundException()
        }
        res.status(200)
            .json({
                statusCode: 200,
                users
            })
    } catch (e) {
        next(e)
    }
}

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await userService.getUser(id)

        if(!user){
            throw new UserNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                user
            })
    } catch (e) {
        next(e)
    }
}

const createNewUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body

        if (!firstName || !lastName || !email || !password) {
            res.status(400)
            throw new Error('All fields are required')
        }

        const allowedRoles = ['teacher', 'student']
        const finalRole = allowedRoles.includes(role) ? role : 'student'

        
        const newUser = await userService.createUser({ firstName, lastName, email, password, role: finalRole })
        res.status(201)
            .json({
                statusCode: 201,
                message: 'User created successfully',
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            })
    } catch (e) {
        next(e)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const { firstName, lastName } = req.body

        const userUpdated = await userService.updateUser(id, { firstName, lastName })

        if(!userUpdated) {
            throw new UserNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                message: 'User updated successfully',
                userUpdated
            })
    } catch (e) {
        next(e)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params

        const userDeleted = await userService.deleteUser(id)

        if(!userDeleted) {
            throw new UserNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                message: 'User deleted successfully',
                userDeleted
            })
    } catch (e) {
        next(e)
    }
}

const getMe = async(req, res, next) => {
    try {
        const user = await userService.getMe(req.user.id)

        if(!user){
            throw new UserNotFoundException()
        }

        res.status(200)
            .json({
                statusCode: 200,
                user
            })

    } catch (e) {
        next(e)
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
    getMe
}