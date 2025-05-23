import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = await registerUser(formData);
      if (data.error || data.message) {
        setError(data.error || data.message);
      } else {
        setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setFormData({ identifier: '', email: '', password: '' });
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError('Erreur réseau ou serveur');
    }
  };

  return (
    <div className="register-container">
      <h1>Inscription</h1>
      {error && <p className="register-error">{error}</p>}
      {success && <p className="register-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="identifier">Identifiant :</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default RegisterPage;
