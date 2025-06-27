// routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/BookInfo"); // adjust if model name is different

// GET books by author (case-insensitive)
router.get('/author/:authorName', async (req, res) => {
  try {
    const books = await Book.find({
      author: { $regex: new RegExp(`^${req.params.authorName}$`, 'i') },
    });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
    res.status(500).json({ message: 'Error fetching books by author' });
  }
});

module.exports = router;
