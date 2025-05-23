const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  const { userID, title, content, answeredMessageID, forumID } = req.body;
  try {
    const message = new Message({ userID, title, content, answeredMessageID, forumID });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (err) {
    res.status(404).json({ error: 'Message non trouvé' });
  }
};

exports.getMessages = async (req, res) => {
  const { forumID } = req.query;
  const messages = await Message.find({ forumID }).sort({ date: -1 }).populate('userID', 'identifier');
  res.json(messages);
};

exports.searchMessages = async (req, res) => {
  const { keywords, author, fromDate, toDate } = req.body;
  const filter = {};

  if (keywords) {
    filter.content = { $regex: keywords, $options: 'i' };
  }

  if (author) {
    filter.userID = author;
  }

  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }

  const results = await Message.find(filter).sort({ date: -1 });
  res.json(results);
};
