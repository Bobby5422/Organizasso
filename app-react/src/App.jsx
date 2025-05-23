import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/Global.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage'; 
import RestrictedForum from './pages/RestrictedForum';

const PrivateRoute = ({ children }) => {
  const { isConnected } = useAuth();
  return isConnected ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/main"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/restricted"
            element={
              <PrivateRoute>
                <RestrictedForum />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
