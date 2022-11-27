const mongoose = require('mongoose')

const { Schema } = mongoose

const schema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    unique: true,
  },
  published: {
    type: Number,
  },
  genres: {
    type: [String],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
})

const Book = mongoose.model('Book', schema)

module.exports = Book
