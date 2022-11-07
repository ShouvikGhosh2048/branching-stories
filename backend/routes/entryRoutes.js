const express = require('express')
const { getSubEntries, addSubEntry } = require('../controllers/entryControllers')
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/:entryId/subentries', getSubEntries)
router.post('/:entryId/subentry', requireAuth, addSubEntry)

module.exports = router