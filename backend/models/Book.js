const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: String,
  title: String,
  author: String,
  year: String,
  genre: String,
  comment: String,
  rating: Number,
  book_cover: String,
  user_email: String,
  user_name: String,
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Book', bookSchema);
