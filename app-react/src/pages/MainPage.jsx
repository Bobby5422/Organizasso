import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { searchMessages } from '../services/api';

import '../styles/MainPage.css';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  // Récupère les messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/messages?forumID=open');
      if (!res.ok) throw new Error('Erreur de récupération');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Au montage, redirige si non connecté sinon charge
  useEffect(() => {
    if (!userID) {
      navigate('/login');
    } else {
      fetchMessages();
    }
  }, [userID, navigate]);

  // Recherche
  const handleSearch = async (filters) => {
    try {
      const results = await searchMessages(filters);
      setMessages(results);
    } catch (err) {
      console.error(err);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Création de message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont obligatoires');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title,
          content,
          forumID: 'open',
          answeredMessageID: null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la création du message');
      }
      setTitle('');
      setContent('');
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  // Envoi d'une réponse
  const handleReplySubmit = async (messageID) => {
    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title: `RE: ${messages.find(m => m._id === messageID)?.title || ''}`,
          content: replyContent,
          forumID: 'open',
          answeredMessageID: messageID,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la création de la réponse');
      }
      setReplyContent('');
      setReplyingTo(null);
      fetchMessages();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="main-page">
      <Header role={role} onLogout={handleLogout} />

      <main className="main-content">
        {error && <p className="error">{error}</p>}

        <h2>Créer un nouveau message</h2>
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
          />
          <button type="submit">Publier</button>
        </form>

        <h2>Messages du forum ouvert</h2>
        <SearchBar onSearch={handleSearch} />

        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <ul className="message-list">
            {messages.map((msg) => (
              <li key={msg._id || msg.messageID} className="message-item">
                <div className="message-content">
                  <strong>{msg.title}</strong> par {msg.userID?.identifier || 'Inconnu'}
                  <p>{msg.content}</p>
                </div>

                <div className="reply-section">
                  {replyingTo === msg._id ? (
                    <>
                      <textarea
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Votre réponse..."
                      />
                      <button onClick={() => handleReplySubmit(msg._id)}>Envoyer réponse</button>
                      <button onClick={() => { setReplyingTo(null); setReplyContent(''); }}>
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setReplyingTo(msg._id)}>Répondre</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MainPage;
