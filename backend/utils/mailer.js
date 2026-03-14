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

const sendConfirmationEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"BookBuddy 📚" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to BookBuddy!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin:auto;">
          
          <h2 style="color:#4A90E2;">Welcome to BookBuddy, ${name}! 📚</h2>

          <p>Your account has been successfully created.</p>

          <p>
            You can now explore books, discover new reads, and manage your reading journey 
            with <strong>BookBuddy</strong>.
          </p>

          <p>
            Start exploring your next favorite book today and build your personal reading collection.
          </p>

          <p>
            If you did not create this account, you can safely ignore this email.
          </p>

          <br>

          <p style="font-size:14px;color:#555;">
            Happy Reading! 📖 <br>
            <strong>The BookBuddy Team</strong>
          </p>

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