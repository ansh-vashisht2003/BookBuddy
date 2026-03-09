const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-digit App Password from .env
  },
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mailer Verification Error:", error.message);
  } else {
    console.log("✅ Mailer is ready to take our messages");
  }
});

const sendConfirmationEmail = async (email, name, password) => {
  try {
    const mailOptions = {
      from: `"BookBuddy 📚" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to BookBuddy!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4A90E2;">Hello, ${name}!</h2>
          <p>Welcome to <strong>BookBuddy</strong>. Your account has been successfully created.</p>
          <p>Your login password is: <strong>${password}</strong></p>
          <p>Keep this safe!</p>
          <br>
          <p>Best regards,<br>The BookBuddy Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ SendMail Error:", error.message);
    return false;
  }
};

module.exports = sendConfirmationEmail;