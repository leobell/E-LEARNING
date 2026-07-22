const User = require('./users.schema')

const getAllUser = async () => {
    return await User.find()
}

const getUser = async (id) => {
    return await User.findById(id)
}

const createUser = async ({ firstName, lastName, email, password, role }) => {
    const userNew = new User({ firstName, lastName, email, password, role })

    return await userNew.save()
}

const updateUser = async (id, { firstName, lastName }) => {
    return await User.findByIdAndUpdate(id, 
        { firstName, lastName }, {
            returnDocument: 'after', 
            runValidators: true 
        })
}

const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id)
}

const getMe = async (userId) => {
    return await User.findById(userId).select('-password -__v')
}

module.exports = {
    getAllUser,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getMe
}