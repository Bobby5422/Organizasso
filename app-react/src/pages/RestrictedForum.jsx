import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import { searchMessages } from '../services/api';

import '../styles/RestrictedForum.css';

const RestrictedForum = () => {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') navigate('/main');
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/messages?forumID=closed');
      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Erreur lors du chargement.");
    }
  };

  const handleSearch = async (filters) => {
    try {
      const results = await searchMessages({ ...filters, forumID: 'restricted' });

      const enriched = await Promise.all(results.map(async (msg) => {
        if (typeof msg.userID === 'string') {
          const res = await fetch(`http://localhost:3000/api/users/${msg.userID}`);
          const userData = await res.json();
          return { ...msg, userID: userData };
        }
        return msg;
      }));

      setMessages(enriched);
    } catch {
      setError("Erreur de recherche.");
    }
  };

  const handleReplySubmit = async (messageID, parentTitle) => {
    if (!replyContent.trim()) {
      setError('Contenu vide');
      return;
    }

    const replyTitle = `RE: ${parentTitle}`;

    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title: replyTitle,
          content: replyContent,
          forumID: 'closed',
          answeredMessageID: messageID,
        }),
      });

      if (!res.ok) throw new Error();

      setReplyContent('');
      setReplyingTo(null);
      fetchMessages();
    } catch {
      setError("Erreur d'envoi");
    }
  };

  const handleNewMessageSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newTitle.trim() || !newContent.trim()) {
      setError('Le titre et le contenu sont obligatoires');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title: newTitle,
          content: newContent,
          forumID: 'closed',
          answeredMessageID: null,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du message');

      setNewTitle('');
      setNewContent('');
      fetchMessages();
    } catch {
      setError("Erreur lors de la création du message");
    }
  };

  return (
    <div>
      <Header role={role} />
      <main style={{ padding: 10 }}>
        <h2>Forum restreint (admin)</h2>

        {/* Formulaire création nouveau message */}
        <h3>Créer un nouveau message</h3>
        <form onSubmit={handleNewMessageSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <br />
          <textarea
            placeholder="Contenu"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
            rows={4}
            cols={50}
          />
          <br />
          <button type="submit">Publier</button>
        </form>

        <SearchBar onSearch={handleSearch} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.title}</strong> par {msg.userID?.identifier || "Inconnu"}<br />
              {msg.content}
              {replyingTo === msg._id ? (
                <>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                  />
                  <button onClick={() => handleReplySubmit(msg._id, msg.title)}>Envoyer</button>
                  <button onClick={() => setReplyingTo(null)}>Annuler</button>
                </>
              ) : (
                <button onClick={() => setReplyingTo(msg._id)}>Répondre</button>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};


export default RestrictedForum;
