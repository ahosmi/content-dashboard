const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  platform: String,
  date: Date,
  status: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
