import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [userID, setUserID] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedConnected = localStorage.getItem('isConnected');
    const storedUserID = localStorage.getItem('userID');
    const storedRole = localStorage.getItem('role');

    if (storedConnected === 'true') {
      setIsConnected(true);
      setUserID(storedUserID);
      setRole(storedRole);
    }
    setLoading(false); 
  }, []);

  useEffect(() => {
    localStorage.setItem('isConnected', isConnected ? 'true' : 'false');
    if (userID) localStorage.setItem('userID', userID);
    else localStorage.removeItem('userID');
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [isConnected, userID, role]);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isConnected, setIsConnected, userID, setUserID, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);