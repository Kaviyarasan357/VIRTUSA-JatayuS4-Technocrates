const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String },
  totalTimeSpentSeconds: { type: Number, default: 0 },
  totalTimeSpentMinutes: {
    type: Number,
    default: function() {
      // Automatically calculate minutes from seconds
      return Math.floor(this.totalTimeSpentSeconds / 60);
    }
  },
  visitCount: { type: Number, default: 1 },
  sentiment: { type: String },
  score: { type: Number },
  lastVisited: { type: Date, default: Date.now },
  parentEmail: { type: String, required: true } // For user-specific aggregation
});

// Middleware to auto-update minutes before saving
siteStatsSchema.pre('save', function(next) {
  this.totalTimeSpentMinutes = Math.floor(this.totalTimeSpentSeconds / 60);
  next();
});

module.exports = mongoose.model('SiteStats', siteStatsSchema);
