const User = require('../models/User');

exports.register = async (req, res) => {
  const { identifier, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ identifier }, { email }]
    });
    if (existingUser) {
      if (existingUser.identifier === identifier) {
        return res.status(400).json({ error: 'Identifiant déjà utilisé' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
    }

    // Pas de doublon, on crée l'utilisateur
    const user = new User({ identifier, email, password, role, validate: false });
    await user.save();
    res.status(201).json({ message: 'Inscription en attente de validation.' });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ error: `${field} déjà utilisé` });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({ identifier, password });
    if (!user) return res.status(401).json({ error: 'Identifiants incorrects' });
    if (!user.validate) return res.status(403).json({ error: 'Compte non validé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.getPendingUsers = async (req, res) => {
  console.log('Route GET /api/users/pending appelée');
  const users = await User.find({ validate: false });
  res.json(users);
};

exports.validateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { validate: true });
  res.json({ message: 'Utilisateur validé' });
};

exports.setUserRole = async (req, res) => {
  const { role } = req.body;
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: 'Rôle mis à jour' });
};
