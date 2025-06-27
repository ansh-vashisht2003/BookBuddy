const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");
const setupSocket = require("./socket");

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/bookpic", express.static(path.join(__dirname, "bookpic")));

// Routes
app.use("/api/users", require("./routes/authRoutes"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/chat", require("./routes/chatRoutes")); // 👈 Chat routes

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
const io = socketIo(server, {
  cors: {
    origin: "*", // or "http://localhost:3000"
    methods: ["GET", "POST"],
  },
});

// Initialize socket handling
setupSocket(io);

// Start server
const PORT = 3001;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
