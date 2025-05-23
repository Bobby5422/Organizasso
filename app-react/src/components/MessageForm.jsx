// app-react/src/components/MessageForm.jsx

import React, { useState } from 'react';
import '../styles/MessageForm.css';

const MessageForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <h2>Créer un nouveau message</h2>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Contenu"
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />

      <button type="submit">Publier</button>
    </form>
  );
};

export default MessageForm;
