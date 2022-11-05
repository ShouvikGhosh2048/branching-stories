const express = require('express')
const { getMe, login, signup } = require('../controllers/userControllers')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/getMe', requireAuth, getMe)
router.post('/signup', signup)
router.post('/login', login)

module.exports = router