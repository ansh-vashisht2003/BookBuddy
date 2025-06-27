const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { uploadProfile } = require('../middleware/uploadMiddleware'); // ✅ Must match exported name

router.post('/signup', uploadProfile.single('profile_pic'), signup);
router.post('/login', login);

module.exports = router;
