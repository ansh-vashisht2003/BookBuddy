require("dotenv").config(); // ✅ Always Line 1
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

// Internal Imports
const connectDB = require("./config/db");
const setupSocket = require("./socket");

// Initialize Express
const app = express();

// Database Connection
connectDB();

/* ===============================
      MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bookpic", express.static(path.join(__dirname, "bookpic")));

/* ===============================
      ROUTES
================================ */
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

/* ===============================
      HTTP & SOCKET SERVER
================================ */
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Initialize Socket Logic
setupSocket(io);

/* ===============================
      START SERVER
================================ */
const PORT = 3001; // ✅ Forced to 3001

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  
  // E-Sarathi style verification: Ensure mailer variables are alive
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log(`📧 Mailer Environment: Active (${process.env.EMAIL_USER})`);
  } else {
    console.error("❌ ERROR: Email credentials missing in .env file!");
  }
});