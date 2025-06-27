const multer = require('multer');
const path = require('path');

// Storage for profile pics
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadProfile = multer({ storage: profileStorage });

// Storage for book cover pics
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'bookpic'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadBookCover = multer({ storage: bookStorage });

module.exports = {
  uploadProfile,
  uploadBookCover
};
