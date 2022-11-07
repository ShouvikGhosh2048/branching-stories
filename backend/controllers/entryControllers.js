const asyncHandler = require('express-async-handler')
const Entry = require('../models/entryModel')

const getSubEntries = asyncHandler(async (req, res) => {
    const entries = await Entry.find({ parent: req.params.entryId, parentModel: 'Entry' })
    res.status(200).json(entries)
})

const addSubEntry = asyncHandler(async (req, res) => {
    const { text } = req.body

    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400)
                    .json({
                        error: 'Valid text required'
                    })
    }

    const entry = await Entry.create({
        text,
        author: req.userId,
        parent: req.params.entryId,
        parentModel: 'Entry'
    })

    res.status(200).json(entry)
})

module.exports = { getSubEntries, addSubEntry }