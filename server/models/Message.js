const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  room: String,
  text: String,
  fileUrl: String,
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
