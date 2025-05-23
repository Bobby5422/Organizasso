const Message = require('../models/Message');
const User = require('../models/User');

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
  const { keywords, author, fromDate, toDate, forumID } = req.body; 
  const filter = {};

  if (keywords) {
  filter.$or = [
    { content: { $regex: keywords, $options: 'i' } },
    { title: { $regex: keywords, $options: 'i' } }
  ];
  delete filter.content; 
  }

  if (forumID) {
    filter.forumID = forumID;
  }

  if (fromDate || toDate) {
    filter.date = {};
    if (fromDate) filter.date.$gte = new Date(fromDate);
    if (toDate) filter.date.$lte = new Date(toDate);
  }

  try {
    if (author) {
      // userID correspondant au username (author)
      const user = await User.findOne({ identifier: author });
      if (!user) {
        // pas de résultats
        return res.json([]);
      }
      filter.userID = user._id;
    }

    const results = await Message.find(filter)
      .sort({ date: -1 })
      .populate('userID', 'identifier');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la recherche de messages' });
  }
};


