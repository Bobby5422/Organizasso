import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MessageForm from '../components/MessageForm';
import MessageItem from '../components/MessageItem';
import { getMessages, searchMessages, createMessage } from '../services/api';

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
      const data = await getMessages('closed');  // utilisation de la fonction importée
      setMessages(data);
      setError('');
    } catch (err) {
      setError("Erreur lors du chargement.");
    }
  };

  const handleSearch = async (filters) => {
    try {
      // Ajout de forumID 'closed' dans les filtres de recherche
      const results = await searchMessages({ ...filters, forumID: 'closed' });
      setMessages(results);
      setError('');
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
      await createMessage({
        userID,
        title,
        content,
        forumID: 'closed',
        answeredMessageID: null,
      });
      await fetchMessages();
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
      const parentMsg = messages.find(m => m._id === messageID);
      await createMessage({
        userID,
        title: `RE: ${parentMsg?.title || ''}`,
        content: replyContent,
        forumID: 'closed',
        answeredMessageID: messageID,
      });
      setReplyContent('');
      setReplyingTo(null);
      await fetchMessages();
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
