const API_BASE = 'http://localhost:3000/api';

// ========== USERS ==========

console.log("API_BASE =", API_BASE)

export const registerUser = async (data) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUserProfile = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}`);
  return res.json();
};

export const getAllUsers = async () => {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
};

export const getPendingUsers = async () => {
  const res = await fetch(`${API_BASE}/users/pending`);
  return res.json();
};

export const validateUser = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}/validate`, {
    method: 'PUT',
  });
  return res.json();
};

export const setUserRole = async (id, role) => {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  return res.json();
};

// ========== MESSAGES ==========

export const createMessage = async (data) => {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteMessage = async (id) => {
  const res = await fetch(`${API_BASE}/messages/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};

export const getMessages = async (forumID = 'open') => {
  const res = await fetch(`${API_BASE}/messages?forumID=${forumID}`);
  return res.json();
};

export const searchMessages = async (filters) => {
  const res = await fetch(`${API_BASE}/messages/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filters),
  });
  return res.json();
};
