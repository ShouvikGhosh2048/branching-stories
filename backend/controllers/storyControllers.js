const asyncHandler = require('express-async-handler')
const Story = require('../models/storyModel')
const Entry = require('../models/entryModel')

const getStories = asyncHandler(async (req, res) => {
    const story = await Story.find({}).populate('author', 'username')
    res.status(200).json(story)
})

const getStory = asyncHandler(async (req, res) => {
    // https://mongoosejs.com/docs/populate.html#field-selection
    const story = await Story.findById(req.params.storyId).populate('author', 'username')
    if (!story) {
        return res.status(400)
                    .json({
                        error: 'No such story exists'
                    })
    }

    res.status(200).json(story)
})

const getStoryEntries = asyncHandler(async (req, res) => {
    const entries = await Entry.find({ parent: req.params.storyId, parentModel: 'Story' })
    res.status(200).json(entries)
})

const createStory = asyncHandler(async (req, res) => {
    const { title, firstEntry } = req.body

    if (!title || !firstEntry
        || typeof title !== 'string' || typeof firstEntry !== 'string'
        || title.trim() === '' || firstEntry.trim() === '') {
            return res.status(400)
                        .json({
                            error: 'Valid title and firstEntry required'
                        })
    }
    
    const story = await Story.create({
        title,
        firstEntry,
        author: req.userId
    })

    res.status(200).json(story)
})

const addEntryToStory = asyncHandler(async (req, res) => {
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
        parent: req.params.storyId,
        parentModel: 'Story'
    })

    res.status(200).json(entry)
})

module.exports = { getStories, getStory, getStoryEntries, createStory, addEntryToStory }