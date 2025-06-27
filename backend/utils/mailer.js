const nodemailer = require('nodemailer');

const sendConfirmationEmail = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'anshvashisht.2003@gmail.com',
        pass: 'fpcgaumtauxapcuq', // App Password from Gmail
      },
    });

    const mailOptions = {
      from: 'anshvashisht.2003@gmail.com',
      to: email,
      subject: 'Signup Confirmation',
      html: `
        <h3>Welcome, ${name}!</h3>
        <p>Your account has been created successfully.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please keep this email safe.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent');
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};

module.exports = sendConfirmationEmail;
