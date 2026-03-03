const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  percentage: {
    type: Number,
    default: 0
  },
  colorClass: {
    type: String,
    default: 'white-card'
  },
  progressBg: String,
  progressFill: String,
  userId: {
    type: String, // This will link the goal to a specific user later
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);