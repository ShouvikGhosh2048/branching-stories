const mongoose = require('mongoose')

// https://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: username => username.trim() !== ''
    },
    hashedPassword: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('User', userSchema)