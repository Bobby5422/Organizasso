import React from 'react';
import '../styles/UserProfile.css';

const UserProfile = ({ user, messages, onDeleteMessage, title = `Profil de ${user.identifier}` }) => {
  return (
    <div className="user-profile">
      <h2>{title}</h2>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Rôle :</strong> {user.role}</p>

      <h3>Messages publiés</h3>
      {messages.length === 0 ? (
        <p>Aucun message publié.</p>
      ) : (
        <ul>
          {messages.map(m => (
            <li key={m._id}>
              <strong>{m.title}</strong><br />
              {m.content}<br />
              <small>Posté le {new Date(m.date).toLocaleString()}</small><br />
              <button onClick={() => onDeleteMessage(m._id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProfile;
