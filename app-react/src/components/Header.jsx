import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';
import logo from '../assets/logo.png';

const Header = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isOnAdminPage = location.pathname === '/admin';
  const isOnMainPage = location.pathname === '/main';
  const isOnProfilePage = location.pathname === '/profile';
  const isOnRestrictedForum = location.pathname === '/restricted';

  return (
    <header>
      <img src={logo} alt="Logo Organiz'asso" className="logo" />
      <h1>Organiz’asso</h1>
      <div>
        {/*On affiche le bouton Accueil seulement si on est pas déjà sur la MainPage*/}
        {!isOnMainPage && (
          <button onClick={() => navigate('/main')}>Accueil</button>
        )} 
          
        {/* Filtre pour le bouton Profil */}
        {isOnMainPage && (
          <button onClick={() => navigate('/profile')}>Profil</button>
        )}

        {/* Filtre pour le bouton Forum Restreint */}
        {role === 'admin' && isOnMainPage && (
          <button onClick={() => navigate('/restricted')}>
            Forum Restreint
          </button>
        )}

        {/* Filtre pour le bouton Admin Dashboard */}
        {role === 'admin' && isOnMainPage && (
          <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
        )}

        <button onClick={handleLogout}>Se déconnecter</button>
      </div>
    </header>
  );
};

export default Header;
