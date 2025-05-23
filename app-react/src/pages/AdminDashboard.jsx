import React, { useEffect, useState } from 'react'
import PendingUserList from '../components/PendingUserList'
import UserList from '../components/UserList'
import { getPendingUsers, getAllUsers, validateUser, setUserRole } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

import '../styles/AdminDashboard.css'

const AdminDashboard = () => {
  const { userID, role } = useAuth()
  const [pendingUsers, setPendingUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])

  const fetchPendingUsers = async () => {
    try {
      const data = await getPendingUsers()
      setPendingUsers(data)
    } catch (error) {
      console.error('Erreur récupération utilisateurs en attente', error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const data = await getAllUsers()
      setAllUsers(data)
    } catch (error) {
      console.error('Erreur récupération utilisateurs', error)
    }
  }

  useEffect(() => {
    fetchPendingUsers()
    fetchAllUsers()
  }, [])

  const handleValidate = async id => {
    try {
      await validateUser(id)
      fetchPendingUsers()
      fetchAllUsers()
    } catch (error) {
      console.error('Erreur validation utilisateur', error)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      await setUserRole(id, newRole)
      fetchAllUsers()
    } catch (error) {
      console.error('Erreur changement rôle', error)
    }
  }

  // Exclure l'admin courant de la liste de gestion
  const filteredUsers = allUsers.filter(u => !(role === 'admin' && u._id === userID))

  return (
    <div>
      <Header role={role} />

      <main className="admin-dashboard">
        <section className="dashboard-column">
          <h2>Utilisateurs en attente</h2>
          <PendingUserList users={pendingUsers} onValidate={handleValidate} />
        </section>

        <section className="dashboard-column">
          <h2>Gérer les utilisateurs</h2>
          <UserList users={filteredUsers} onRoleChange={handleRoleChange} />
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
