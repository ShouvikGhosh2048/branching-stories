const mongoose = require('mongoose')

// https://mongoosejs.com/docs/populate.html#dynamic-ref
// https://stackoverflow.com/a/64817818
const entrySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        validate: text => text.trim() !== ''
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        refPath: 'parentModel',
        required: true,
    },
    parentModel: {
        type: String,
        required: true,
        enum: ['Story', 'Entry']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Entry', entrySchema)