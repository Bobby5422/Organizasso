import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

import '../styles/LoginPage.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsConnected, setUserID, setRole } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ identifier, password });
      setLoading(false);

      if (response.error || response.message) {
        setError(response.error || response.message);
      } else {
        setIsConnected(true);
        setUserID(response._id);
        setRole(response.role);
        navigate('/main');
      }
    } catch (err) {
      setLoading(false);
      setError('Erreur réseau ou serveur');
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Identifiant"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
      <p>
        Pas encore inscrit ?{' '}
        <Link to="/register">
          Créez un compte
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
