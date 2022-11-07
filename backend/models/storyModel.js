const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: title => title.trim() !== ''
    },
    firstEntry: {
        type: String,
        required: true,
        validate: firstEntry => firstEntry.trim() !== ''
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Story', storySchema)