// src/pages/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MessageForm from '../components/MessageForm';
import MessageItem from '../components/MessageItem';
import { getMessages, searchMessages, createMessage } from '../services/api';
import '../styles/MainPage.css';

const MainPage = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const role = localStorage.getItem('role');
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const data = await getMessages('open');
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
    <>
      <Header role={role} onLogout={handleLogout} />
      <div className="main-page-content">
        <div className="main-page">
          <main className="main-content">
            {/* Colonne de gauche */}
            <section className="left-col">
              <MessageForm onSubmit={handleCreateMessage} />
            </section>

            {/* Colonne de droite */}
            <section className="right-col">
              <h2>Messages du forum ouvert</h2>
              <div className="search-bar-container">
                <SearchBar onSearch={handleSearch} />
              </div>

              {error && <p className="error">{error}</p>}

              <ul className="message-list">
                {messages.length === 0 ? (
                  <li className="no-message">Aucun message pour le moment.</li>
                ) : (
                  messages.map((msg) => (
                    <MessageItem
                      key={msg._id}
                      msg={msg}
                      replyingTo={replyingTo}
                      setReplyingTo={setReplyingTo}
                      replyContent={replyContent}
                      setReplyContent={setReplyContent}
                      handleReplySubmit={handleReplySubmit}
                    />
                  ))
                )}
              </ul>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default MainPage;
