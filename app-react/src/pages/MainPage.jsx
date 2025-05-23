import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MessageForm from '../components/MessageForm';
import MessageItem from '../components/MessageItem';
import { getMessages, searchMessages, createMessage } from '../services/api'; // <-- Import API ici
import '../styles/MainPage.css';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  // Récupérer les messages du forum ouvert
  const fetchMessages = async () => {
    try {
      const data = await getMessages('open');  // Utilisation de la fonction importée
      setMessages(data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des messages');
    }
  };

  useEffect(() => {
    if (!userID) {
      navigate('/login');
    } else {
      fetchMessages();
    }
  }, [userID, navigate]);

  const handleSearch = async (filters) => {
    try {
      // Ajoute forumID 'open' pour filtrer uniquement le forum ouvert
      const results = await searchMessages({ ...filters, forumID: 'open' });
      setMessages(results);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la recherche');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleCreateMessage = async ({ title, content }) => {
    try {
      await createMessage({
        userID,
        title,
        content,
        forumID: 'open',
        answeredMessageID: null,
      });
      await fetchMessages();
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du message');
    }
  };

  const handleReplySubmit = async (messageID) => {
    if (!replyContent.trim()) {
      setError('Le contenu de la réponse est vide');
      return;
    }
    try {
      const parentMsg = messages.find((m) => m._id === messageID);
      await createMessage({
        userID,
        title: `RE: ${parentMsg?.title || ''}`,
        content: replyContent,
        forumID: 'open',
        answeredMessageID: messageID,
      });
      setReplyContent('');
      setReplyingTo(null);
      await fetchMessages();
    } catch (err) {
      setError(err.message || 'Erreur lors de l’envoi de la réponse');
    }
  };

  return (
    <div className="main-page">
      <Header role={role} onLogout={handleLogout} />

      <main className="main-content">
        <MessageForm onSubmit={handleCreateMessage} />

        <h2>Messages du forum ouvert</h2>
        <SearchBar onSearch={handleSearch} />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {messages.length === 0 ? (
          <p>Aucun message pour le moment.</p>
        ) : (
          <ul className="message-list">
            {messages.map((msg) => (
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

export default MainPage;
