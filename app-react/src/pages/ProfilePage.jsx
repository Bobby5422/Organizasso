import { useEffect, useState } from 'react';
import { getUserProfile, getMessages, getAllUsers, deleteMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';

import '../styles/ProfilePage.css';

function ProfilePage() {
  const { userID } = useAuth();
  const role = localStorage.getItem('role');
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const handleDelete = async (messageID) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    try {
      await deleteMessage(messageID);
      setMessages(prev => prev.filter(m => m._id !== messageID));
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
      <UserProfile
        user={user}
        messages={messages}
        onDeleteMessage={handleDelete}
        title="Mon profil"
      />

      <h3>Autres utilisateurs</h3>
      <ul>
        {allUsers
          .filter(u => u._id !== userID)
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
