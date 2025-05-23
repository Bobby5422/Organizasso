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
  const [replyingTo, setReplyingTo] = useState(null);  // ID du message auquel on répond
  const [replyContent, setReplyContent] = useState('');
  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userID) {
      navigate('/login');
      return;
    }
    fetchMessages();
  }, [userID]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/messages?forumID=open`);
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError('Erreur lors du chargement des messages');
    }
  };

  const handleSearch = async (filters) => {
  try {
    const results = await searchMessages(filters);
    setMessages(results);
  } catch (err) {
    setError('Erreur lors de la recherche.');
    console.error(err);
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Création d'un nouveau message principal
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

  // Création d'une réponse à un message
  const handleReplySubmit = async (messageID) => {
    if (!replyContent.trim()) {
      setError('Le contenu de la réponse est obligatoire');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title: 'RE: ', // Optionnel : tu peux adapter ou demander un titre
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
    <div>
      <Header role={role} />

      <main style={{ padding: 10 }}>
        <h2>Créer un nouveau message</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <br /><header style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
      </header>
          <textarea
            placeholder="Contenu"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            cols={50}
          />
          <br />
          <button type="submit">Publier</button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <h2>Messages du forum ouvert</h2>
        
        <SearchBar onSearch={handleSearch} />

        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <ul>
            {messages.map((msg) => (
              <li key={msg._id || msg.messageID} style={{ marginBottom: 20 }}>
                <strong>{msg.title}</strong> par {msg.userID?.identifier || "Utilisateur Inconnu"} <br />
                {msg.content}

                <div style={{ marginTop: 8 }}>
                  {replyingTo === msg._id ? (
                    <>
                      <textarea
                        rows={3}
                        cols={50}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Votre réponse..."
                      />
                      <br />
                      <button onClick={() => handleReplySubmit(msg._id)}>Envoyer réponse</button>
                      <button onClick={() => { setReplyingTo(null); setReplyContent(''); }} style={{ marginLeft: 8 }}>
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
