import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // <-- ajout de useLocation
import '../styles/Header.css';

const Header = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- récupère la route actuelle

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isOnAdminPage = location.pathname === '/admin'; // <-- vérifie la route

  return (
    <header>
      <div>🚀 Organiz’asso</div>
      <h1>Organiz’asso</h1>
      <div>
        <button onClick={() => navigate('/main')}>Accueil</button>
        {/* Affiche Admin Dashboard seulement si on n'est pas déjà dessus */}
        {role === 'admin' && !isOnAdminPage && (
          <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
        )}
        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </header>
  );
};

export default Header;
