const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/Book');

// 📁 Multer setup for book cover upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'bookpic'); // Folder to store book covers
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📤 Upload a new book
router.post('/upload', upload.single('book_cover'), async (req, res) => {
  try {
    const {
      isbn,
      title,
      author,
      year,
      genre,
      comment,
      rating,
      user_email,
      user_name,
    } = req.body;

    const newBook = new Book({
      isbn,
      title,
      author,
      year,
      genre,
      comment,
      rating,
      book_cover: req.file.filename,
      user_email,
      user_name,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload book' });
  }
});

// 📥 Get books uploaded by a specific user
router.get('/user_email/:email', async (req, res) => {
  try {
    const books = await Book.find({ user_email: req.params.email }).sort({ uploaded_at: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// 🗑️ Delete a book by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔍 Search suggestions (by title or author)
router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  try {
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    res.json(books);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

// 📚 Get all books (optionally filter by genre) with uploader info
router.get('/', async (req, res) => {
  try {
    const genreFilter = req.query.genre || '';

    const matchStage = genreFilter
      ? { genre: { $regex: new RegExp(genreFilter, 'i') } }
      : {};

    const books = await Book.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users', // 🧩 Join with 'users' collection
          localField: 'user_email',
          foreignField: 'email',
          as: 'uploader',
        },
      },
      {
        $unwind: {
          path: '$uploader',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          isbn: 1,
          title: 1,
          author: 1,
          year: 1,
          genre: 1,
          comment: 1,
          rating: 1,
          book_cover: 1,
          uploaded_at: 1,
          user_email: 1,
          user_name: '$uploader.name',
          profile_pic: '$uploader.profile_pic',
        },
      },
      { $sort: { uploaded_at: -1 } }
    ]);

    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
