const express = require('express')
const { getStory, createStory, addEntryToStory, getStoryEntries } = require('../controllers/storyControllers')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:storyId', getStory)
router.get('/:storyId/entries', getStoryEntries)
router.post('/', requireAuth, createStory)
router.post('/:storyId/entry', requireAuth, addEntryToStory)

module.exports = router