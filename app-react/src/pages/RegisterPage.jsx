import React, { useState } from 'react';
import { registerUser } from '../services/api'; // vérifie chemin correct

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      }
    } catch (err) {
      setError('Erreur réseau ou serveur');
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Identifiant :</label>
          <input
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
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
