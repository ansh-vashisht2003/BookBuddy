// backend/routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  const { email, name, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anshvashisht.2003@gmail.com',
        pass: 'cclk szit igox hrcm',
      },
    });

    await transporter.sendMail({
      from: email,
      to: 'anshvashisht.2003@gmail.com',
      subject: 'Query in the BookBuddy',
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
