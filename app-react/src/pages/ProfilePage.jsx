import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, getMessages, deleteMessage } from '../services/api';

function ProfilPage() {
  const { id } = useParams(); // ID de l'utilisateur depuis l'URL
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserProfile(id);
      setUser(userData);

      const allMessages = await getMessages(); // récupère tous les messages
      const userMessages = allMessages.filter(msg => msg.userID === id);
      setMessages(userMessages);
    };

    fetchData();
  }, [id]);

  const handleDelete = async (messageId) => {
    await deleteMessage(messageId);
    setMessages(messages.filter(msg => msg._id !== messageId));
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Profil de {user.identifier}</h2>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.role}</p>
      <p>Validé : {user.validate ? 'Oui' : 'Non'}</p>

      <h3>Messages publiés</h3>
      {messages.length === 0 ? (
        <p>Aucun message publié.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.title}</strong><br />
              {msg.content}<br />
              <small>Posté le {new Date(msg.date).toLocaleString()}</small><br />
              <button onClick={() => handleDelete(msg._id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfilPage;
