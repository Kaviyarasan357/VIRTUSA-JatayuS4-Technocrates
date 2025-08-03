const mongoose = require('mongoose');

const sentimentLogSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  sentiment: { type: String, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, required: true }, // expects Date.now() (milliseconds)
  parentEmail: { type: String, default: null }, // optional if provided

  // ✅ New fields added below:
  visitCount: { type: Number, default: 0 },
  totalTimeSpentSeconds: { type: Number, default: 0 },
  totalTimeSpentMinutes: { type: Number, default: 0 },
  lastVisited: { type: Date, default: Date.now }
}, { strict: true });

const SentimentLog = mongoose.model('SentimentLog', sentimentLogSchema);

module.exports = SentimentLog;
