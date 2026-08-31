const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    categories: {
      type: [String],
      default: ['general'],
    },
    frequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily'],
      default: 'daily',
    },
    subscribed: { type: Boolean, default: true },
    lastSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
