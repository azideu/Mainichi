import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on mount
    const token = localStorage.getItem('mainichi_token');
    const storedUser = localStorage.getItem('mainichi_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mainichi_token');
        localStorage.removeItem('mainichi_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('mainichi_token', data.token);
      localStorage.setItem('mainichi_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      alert(error.message);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('mainichi_token', data.token);
      localStorage.setItem('mainichi_user', JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      alert(error.message);
      return false;
    }
  };

  const updateProfile = async (name, profile_picture) => {
    try {
      const token = localStorage.getItem('mainichi_token');
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, profile_picture })
      });
      
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Update failed');

      const updatedUser = { ...user, name, profile_picture };
      localStorage.setItem('mainichi_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update failed", error);
      alert(error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mainichi_token');
    localStorage.removeItem('mainichi_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
