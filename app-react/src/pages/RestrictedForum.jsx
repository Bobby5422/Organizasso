import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MessageForm from '../components/MessageForm';
import MessageItem from '../components/MessageItem';
import { searchMessages } from '../services/api';

import '../styles/RestrictedForum.css';

const RestrictedForum = () => {
  const [messages, setMessages] = useState([]);
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState('');

  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/main');
      return;
    }
    fetchMessages();
  }, [role, navigate]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/messages?forumID=closed');
      if (!res.ok) throw new Error('Erreur de récupération');
      const data = await res.json();
      setMessages(data);
    } catch {
      setError("Erreur lors du chargement.");
    }
  };

  const handleSearch = async (filters) => {
    try {
      // On ajoute forumID closed dans les filtres
      const results = await searchMessages({ ...filters, forumID: 'closed' });

      // Si besoin, enrichir userID (si c'est une string)
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

  const handleNewMessageSubmit = async ({ title, content }) => {
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
          forumID: 'closed',
          answeredMessageID: null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Erreur lors de la création du message');
      }
      fetchMessages();
    } catch {
      setError("Erreur lors de la création du message");
    }
  };

  const handleReplySubmit = async (messageID) => {
    if (!replyContent.trim()) {
      setError('Le contenu de la réponse ne peut pas être vide');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userID,
          title: `RE: ${messages.find(m => m._id === messageID)?.title || ''}`,
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="restricted-forum">
      <Header role={role} onLogout={handleLogout} />

      <main className="main-content" style={{ padding: 10 }}>
        <h2>Forum restreint (admin)</h2>

        <MessageForm onSubmit={handleNewMessageSubmit} />

        <SearchBar onSearch={handleSearch} />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <ul className="message-list">
            {messages.map(msg => (
              <MessageItem
                key={msg._id}
                msg={msg}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                handleReplySubmit={handleReplySubmit}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default RestrictedForum;
