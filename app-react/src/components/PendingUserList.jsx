import React from 'react';

import '../styles/PendingUserList.css';

const PendingUserList = ({ users, onValidate }) => {
  return (
    <div>
      <h3>Utilisateurs en attente de validation</h3>
      {users.length === 0 && <p>Aucun utilisateur en attente.</p>}
      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.identifier} ({u.email}){' '}
            <button onClick={() => onValidate(u._id)}>Valider</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingUserList;
