import React, { useState } from 'react';

const MessageItem = ({ msg, replyingTo, setReplyingTo, replyContent, setReplyContent, handleReplySubmit }) => {
  return (
    <li className="message-item">
      <div className="message-content">
        <strong>{msg.title}</strong> par {msg.userID?.identifier || 'Inconnu'}
        <p>{msg.content}</p>
      </div>

      <div className="reply-section">
        {replyingTo === msg._id ? (
          <>
            <textarea
              rows={3}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Votre réponse..."
            />
            <button onClick={() => handleReplySubmit(msg._id)}>Envoyer réponse</button>
            <button onClick={() => { setReplyingTo(null); setReplyContent(''); }}>
              Annuler
            </button>
          </>
        ) : (
          <button onClick={() => setReplyingTo(msg._id)}>Répondre</button>
        )}
      </div>
    </li>
  );
};

export default MessageItem;
