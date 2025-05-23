// src/pages/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: 10 }}>
        <div>🚀 Organiz’asso</div>
        <h1 style={{ margin: 0 }}>Organiz’asso</h1>
        <div>
          {role === 'admin' && (
            <button onClick={() => navigate('/admin')} style={{ marginRight: 10 }}>
              Admin Dashboard
            </button>
          )}
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </header>

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
          <br />
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
        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <ul>
            {messages.map((msg) => (
              <li key={msg._id || msg.messageID}>
                <strong>{msg.title}</strong> par {msg.userID} <br />
                {msg.content}
                {/* Tu peux ajouter ici un bouton "Répondre" */}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MainPage;
