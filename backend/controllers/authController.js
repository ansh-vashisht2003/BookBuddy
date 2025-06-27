const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const profile_pic = req.file?.filename;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile_pic
    });

    await newUser.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anshvashisht.2003@gmail.com',
        pass: 'cclk szit igox hrcm',
      },
    });

    await transporter.sendMail({
      from: 'anshvashisht.2003@gmail.com',
      to: email,
      subject: 'Welcome to BookBuddy!',
      html: `
        <p>Hello ${name},</p>
        <p>Your signup was successful.</p>
        <p><strong>Email:</strong> ${email}<br><strong>Password:</strong> ${password}</p>
        <p>Start your reading journey with BookBuddy!</p>
      `,
    });

    res.status(201).json({ message: 'Signup successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_pic: user.profile_pic,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = {
  signup,
  login,
};
