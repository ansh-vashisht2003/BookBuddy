const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendConfirmationEmail = require('../utils/mailer'); 

/**
 * @desc    Register a new user & send welcome email
 * @route   POST /api/users/signup
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const profile_pic = req.file?.filename;

    // 1. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save User to MongoDB
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      profile_pic 
    });
    await user.save();

    // 4. Trigger Email in Background
    // We don't use 'await' here because we want the user to get a 
    // "Success" response immediately without waiting for the email server.
    sendConfirmationEmail(email, name, password)
      .then(sent => {
        if (sent) console.log(`📧 Welcome email sent to ${email}`);
      })
      .catch(err => console.error("📧 Email background error:", err.message));

    // 5. Send Success Response
    res.status(201).json({ 
      message: 'Signup successful! Welcome to BookBuddy.',
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

/**
 * @desc    Authenticate user & Login
 * @route   POST /api/users/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // 2. Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    // 3. Send Success Response
    res.status(200).json({ 
      message: "Login successful", 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

module.exports = { signup, login };