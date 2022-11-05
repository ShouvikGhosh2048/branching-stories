const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const signup = asyncHandler(async (req, res) => {
    let { username, password } = req.body

    if (!username || !password
        || typeof username !== "string" || typeof password !== "string"
        || username.trim() === "") {
            return res.status(400)
                        .json({
                            error: 'Valid username and password required'
                        })
    }

    username = username.trim()

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    try {
        const { _id } = await User.create({
            username,
            hashedPassword,
        })
        const token = jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: '7d' })
        res.status(200).json(token)
    } catch (err) {
        if (err.message.includes('duplicate key error')) { // Username needs to be unique
            res.status(400)
                .json({
                    error: 'User with the given username already exists'
                })
        }
        else {
            throw err
        }
    }
})

const login = asyncHandler(async (req, res) => {
    let { username, password } = req.body

    if (!username || !password 
        || typeof username !== "string" || typeof password !== "string"
        || username.trim() === "") {
            return res.status(400)
                        .json({
                            error: 'Valid username and password required'
                        })
    }

    username = username.trim()

    const user = await User.findOne({ username })
    if (!user) {
        // https://stackoverflow.com/questions/45357111/what-status-code-should-a-rest-api-return-for-login-requests-performed-with-wron
        // https://stackoverflow.com/a/45357230
        return res.status(401)
                    .json({
                        error: 'Invalid credentials'
                    })
    }

    const { hashedPassword } = user
    const isCorrectPassword = await bcrypt.compare(password, hashedPassword)

    if (!isCorrectPassword) {
        return res.status(401)
                    .json({
                        error: 'Invalid credentials'
                    })
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' })
    res.status(200).json(token)
})

const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId)
    if (!user) {
        return res.status(401)
            .json({
                error: 'Invalid authorization'
            })
    }

    res.status(200)
        .json({
            username: user.username
        })
})

module.exports = { signup, login, getMe }