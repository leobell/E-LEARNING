const express = require('express')
const cors = require('cors')
require('dotenv').config()
const startServer = require('./config/db')
const PORT = process.env.PORT
const server = express()

// middlewares
const errorHandler = require('./middlewares/errors/errorHandler') 

// routes
const userRoutes = require('./modules/users/users.route')
const authRoute = require('./modules/auth/auth.route')
const courseRoute = require('./modules/courses/courses.route')
const moduleRoute = require('./modules/module/module.route')
const lessonRoute = require('./modules/lessons/lessons.route')
const progressRoute = require('./modules/progress/progress.route')
const reviewRoute = require('./modules/review/review.route')

server.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

server.use(express.json())

server.use('/', userRoutes)
server.use('/', authRoute)
server.use('/', courseRoute)
server.use('/', moduleRoute)
server.use('/', lessonRoute)
server.use('/', progressRoute)
server.use('/', reviewRoute)

server.use(errorHandler)

startServer(PORT, server)