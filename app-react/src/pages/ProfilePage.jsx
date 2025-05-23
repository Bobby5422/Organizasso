import { useEffect, useState } from 'react';
import { getUserProfile, getMessages, getAllUsers } from '../services/api';
import { useAuth } from '../context/AuthContext'
import { deleteMessage } from '../services/api';
import Header from '../components/Header';


import '../styles/ProfilePage.css';

function ProfilePage() {
  const { userID } = useAuth(); // utilisateur connecté
  const role = localStorage.getItem('role');
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const handleDelete = async (messageID) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await deleteMessage(messageID);
      setMessages(messages.filter(m => m._id !== messageID));
    } catch (err) {
      alert("Erreur lors de la suppression.");
      console.error(err);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserProfile(userID);
      setUser(userData);

      const allMsgs = await getMessages();
      setMessages(allMsgs.filter(m => m.userID?._id === userID || m.userID === userID));

      const users = await getAllUsers();
      setAllUsers(users);
    };

    fetchData();
  }, [userID]);

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="profile-page">
      <Header role={role} />
      <h2>Mon profil</h2>
      <p><strong>Identifiant :</strong> {user.identifier}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Rôle :</strong> {user.role}</p>

      <h3>Mes messages</h3>
      {messages.length === 0 ? (
        <p>Aucun message publié.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg._id} style={{ marginBottom: 10 }}>
              <strong>{msg.title}</strong><br />
              {msg.content}<br />
              <small>Posté le {new Date(msg.date).toLocaleString()}</small><br />
              <button onClick={() => handleDelete(msg._id)}>
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Autres utilisateurs</h3>
      <ul>
        {allUsers
          .filter(u => u._id !== userID) // exclut soi-même
          .map(u => (
            <li key={u._id}>
              {u.identifier} - rôle : {u.role}
            </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfilePage;
