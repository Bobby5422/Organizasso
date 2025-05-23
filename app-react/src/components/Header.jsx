import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header>
      <div>🚀 Organiz’asso</div>
      <h1>Organiz’asso</h1>
      <div>
        {role === 'admin' && (
          <button onClick={() => navigate('/admin')}>
            Admin Dashboard
          </button>
        )}
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </header>
  );
};

export default Header;
