import React from 'react';

import '../styles/UserProfile.css';

const UserProfile = ({ user, messages, onDeleteMessage }) => {
  return (
    <div>
      <h2>Profil de {user.identifier}</h2>
      <p>Email: {user.email}</p>
      <h3>Messages publiés</h3>
      {messages.length === 0 && <p>Aucun message publié.</p>}
      <ul>
        {messages.map(m => (
          <li key={m.messageID}>
            <strong>{m.title}</strong> - {m.content}
            <button onClick={() => onDeleteMessage(m.messageID)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
