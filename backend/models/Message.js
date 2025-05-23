const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  answeredMessageID: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
  forumID: { type: String, enum: ['open', 'closed'], required: true },
});

module.exports = mongoose.model('Message', messageSchema);