// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = 3000; // ou autre

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API Organiz’asso !');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
