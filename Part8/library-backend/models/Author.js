const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  born: {
    type: Number,
  },
})

const Author = mongoose.model('Author', schema)

module.exports = Author
