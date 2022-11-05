const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const requireAuth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401)
            .json({
                error: 'Invalid authorization'
            })
    }

    const token = authorization.split(' ')[1]
    if (!token) {
        return res.status(401)
            .json({
                error: 'Invalid authorization'
            })
    }

    try {
        const { _id } = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = _id
        next()
    } catch (err) {
        return res.status(401)
            .json({
                error: 'Invalid authorization'
            })
    }
})

module.exports = { requireAuth }