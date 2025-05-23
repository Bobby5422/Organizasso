const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  identifier: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  validate: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
