// src/pages/AdminDashboard.jsx
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

  const filteredUsers = allUsers.filter(u => !(role === 'admin' && u._id === userID))

  return (
    <div className="admin-dashboard">
      <Header role={role} />

      <h2 className="admin-dashboard__title">Admin Dashboard</h2>

      <div className="admin-dashboard__lists">
        <section className="admin-dashboard__pending">
          <PendingUserList users={pendingUsers} onValidate={handleValidate} />
        </section>

        <section className="admin-dashboard__users">
          <UserList users={filteredUsers} onRoleChange={handleRoleChange} />
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
