import React, { useState } from 'react';
import '../styles/MessageForm.css'; // Tu peux ajouter des styles dédiés si besoin

const MessageForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Le titre et le contenu sont obligatoires');
      return;
    }

    try {
      await onSubmit({ title, content });
      setTitle('');
      setContent('');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="message-form-container">
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
    </div>
  );
};

export default MessageForm;
