import React from 'react';

const UserList = ({ users, onRoleChange }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Identifiant</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Validé</th>
          <th>Changer rôle</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u._id}>
            <td>{u.identifier}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.validate ? 'Oui' : 'Non'}</td>
            <td>
              {u.validate && (
                <>
                  {u.role === 'admin' ? (
                    <button onClick={() => onRoleChange(u._id, 'member')}>
                      Retirer admin
                    </button>
                  ) : (
                    <button onClick={() => onRoleChange(u._id, 'admin')}>
                      Donner admin
                    </button>
                  )}
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;
