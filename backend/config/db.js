const mongoose = require('mongoose')
require('dotenv').config()

const initDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log('Db not connected', error.message)
        process.exit(1)
    }
}

const startServer = async (port, server) => {
    await initDb()
    server.listen(port, () => {
        console.log(`Server up and running on ${port}`)
    })

}

module.exports = startServer