import React, { useState } from 'react';

import '../styles/MessageItem.css';

const MessageItem = ({ message, onReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = e => {
    e.preventDefault();
    onReply(message.messageID, replyContent);
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <li>
      <strong>{message.title}</strong> par {message.userID}
      <p>{message.content}</p>
      <button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? 'Annuler' : 'Répondre'}
      </button>
      {showReplyForm && (
        <form onSubmit={handleReplySubmit}>
          <textarea
            rows={3}
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            required
          />
          <button type="submit">Envoyer réponse</button>
        </form>
      )}
    </li>
  );
};

export default MessageItem;
