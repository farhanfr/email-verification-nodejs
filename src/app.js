const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('./db/connectDB')

const app = express()

const AuthRoutes = require('./routes/auth')

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.use('/api',AuthRoutes)

module.exports = app