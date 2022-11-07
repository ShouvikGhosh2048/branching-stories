const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const storyRoutes = require('./routes/storyRoutes')
const entryRoutes = require('./routes/entryRoutes')
require('dotenv').config()

const app = express()

app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/story', storyRoutes)
app.use('/api/entry', entryRoutes)

// https://youtu.be/UXjMo25Nnvc
app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')))

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