const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favouriteGenre: {
    type: String,
    required: true,
  },
})

const User = mongoose.model('User', schema)

module.exports = User
