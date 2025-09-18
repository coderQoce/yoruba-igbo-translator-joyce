const mongoose = require('mongoose');

const meaningSchema = new mongoose.Schema({
  tone: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    required: true,
    trim: true
  }
});

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  meanings: [meaningSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
wordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for searching
wordSchema.index({ word: 'text', 'meanings.tone': 'text' });

module.exports = mongoose.model('Word', wordSchema);