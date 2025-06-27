const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const profile_pic = req.file?.filename;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role, profile_pic });
    await user.save();

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
      html: `<p>Hello ${name},</p><p>Your signup is successful. Your password: <b>${password}</b></p>`,
    });

    res.status(201).json({ message: 'Signup successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    res.json({ message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { signup, login };
