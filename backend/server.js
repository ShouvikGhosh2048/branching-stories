const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
require('dotenv').config()

const app = express()

app.use(express.json())

app.use('/api/user', userRoutes)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500)
        .json({
            error: 'Server error'
        })
})

mongoose.connect(process.env.DB_URL, () => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`)
    })
})