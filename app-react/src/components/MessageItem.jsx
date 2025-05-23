import React from 'react';
import '../styles/MessageItem.css';

const MessageItem = ({
  msg,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  handleReplySubmit
}) => {
  const isReplying = replyingTo === msg._id;

  return (
    <li className="message-item">
      <div className="message-content">
        <strong className="message-title">{msg.title}</strong>
        <div className="message-meta">par {msg.userID?.identifier || 'Inconnu'}</div>
        <p className="message-body">{msg.content}</p>
      </div>

      <div className="reply-section">
        {isReplying ? (
          <>
            <textarea
              className="reply-textarea"
              rows={3}
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Votre réponse..."
            />
            <div className="reply-buttons">
              <button
                className="button reply-send"
                onClick={() => handleReplySubmit(msg._id)}
              >
                Envoyer
              </button>
              <button
                className="button reply-cancel"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Annuler
              </button>
            </div>
          </>
        ) : (
          <button
            className="button reply-toggle"
            onClick={() => setReplyingTo(msg._id)}
          >
            Répondre
          </button>
        )}
      </div>
    </li>
  );
};

export default MessageItem;
