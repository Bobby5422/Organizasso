import React, { useEffect, useState } from 'react';
import PendingUserList from '../components/PendingUserList';
import UserList from '../components/UserList';
import { getPendingUsers, getAllUsers, validateUser, setUserRole } from '../services/api';
import { useAuth } from '../context/AuthContext';  // <- import du contexte

import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { userID, role } = useAuth(); // récupère l'admin connecté
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      console.error('Erreur récupération utilisateurs en attente', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (error) {
      console.error('Erreur récupération utilisateurs', error);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchAllUsers();
  }, []);

  const handleValidate = async (userID) => {
    try {
      await validateUser(userID);
      fetchPendingUsers();
      fetchAllUsers();
    } catch (error) {
      console.error('Erreur validation utilisateur', error);
    }
  };

  const handleRoleChange = async (userID, newRole) => {
    try {
      await setUserRole(userID, newRole);
      fetchAllUsers();
    } catch (error) {
      console.error('Erreur changement rôle', error);
    }
  };

  // Filtrer la liste des utilisateurs pour exclure l'admin connecté
  const filteredUsers = allUsers.filter(u => !(role === 'admin' && u._id === userID));

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <PendingUserList users={pendingUsers} onValidate={handleValidate} />

      {/* Utiliser la liste filtrée */}
      <UserList users={filteredUsers} onRoleChange={handleRoleChange} />
    </div>
  );
};

export default AdminDashboard;
