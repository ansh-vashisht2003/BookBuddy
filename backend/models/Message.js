const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String }, // email
  receiver: { type: String }, // email
  content: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
