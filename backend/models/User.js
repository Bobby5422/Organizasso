const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true },
  email: String,
  password: String,
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  validate: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
