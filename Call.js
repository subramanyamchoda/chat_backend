const mongoose = require('mongoose');

const CallSchema = new mongoose.Schema({
  callerId: { type: String, required: true },
  receiverId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }, // seconds
  status: { type: String, enum: ['missed','declined','completed','ongoing'], default: 'completed' }
});

module.exports = mongoose.model('Call', CallSchema);
