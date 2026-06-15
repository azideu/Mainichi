import React, { createContext, useContext, useState, useEffect } from 'react';
import { IS_APP_INVENTOR, getFromTinyDB } from '../utils/appInventorBridge';
import { clearGuestProgressInTinyDB, syncGuestProgressToTinyDB } from '../utils/guestMockApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Initial quick state load from local/session storage (optimistic UX)
      const token = localStorage.getItem('mainichi_token') || sessionStorage.getItem('mainichi_token');
      const storedUserStr = localStorage.getItem('mainichi_user') || sessionStorage.getItem('mainichi_user');
      let initialUser = null;
      if (token && storedUserStr) {
        try {
          initialUser = JSON.parse(storedUserStr);
          setUser(initialUser);
        } catch (e) {
          localStorage.removeItem('mainichi_token');
          localStorage.removeItem('mainichi_user');
          sessionStorage.removeItem('mainichi_token');
          sessionStorage.removeItem('mainichi_user');
        }
      }

      // If in App Inventor, try to load guest session from TinyDB
      if (IS_APP_INVENTOR && !initialUser) {
        const handleTinyDBSync = async (e) => {
          const data = e.detail;
          if (data && data.user) {
            try {
              sessionStorage.setItem('mainichi_token', data.token);
              sessionStorage.setItem('mainichi_user', JSON.stringify(data.user));
              sessionStorage.setItem('mainichi_guest', 'true');
              if (data.stats) sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(data.stats));
              if (data.reviews) sessionStorage.setItem('mainichi_guest_progress', JSON.stringify(data.reviews));
              if (data.completedLessons) sessionStorage.setItem('mainichi_guest_completed_lessons', JSON.stringify(data.completedLessons));
              if (data.unlockedDecks) sessionStorage.setItem('mainichi_guest_downloaded_decks', JSON.stringify(data.unlockedDecks));
              
              setUser(data.user);
              await verifySessionWithBackend(data.token);
            } catch (err) {
              console.error("Error setting guest data from TinyDB:", err);
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
          window.removeEventListener('mainichi-tinydb-guest-sync', handleTinyDBSync);
        };

        window.addEventListener('mainichi-tinydb-guest-sync', handleTinyDBSync);
        getFromTinyDB('mainichi_guest_data');

        const timer = setTimeout(() => {
          setLoading(false);
          window.removeEventListener('mainichi-tinydb-guest-sync', handleTinyDBSync);
        }, 1500);

        return () => {
          clearTimeout(timer);
          window.removeEventListener('mainichi-tinydb-guest-sync', handleTinyDBSync);
        };
      }

      // 2. Perform backend silent validation
      if (token) {
        await verifySessionWithBackend(token);
      } else {
        setLoading(false);
      }
    };

    const verifySessionWithBackend = async (currentToken) => {
      try {
        const headers = {};
        if (currentToken && currentToken !== 'cookie_session') {
          headers['Authorization'] = `Bearer ${currentToken}`;
        }
        
        const response = await fetch('/api/auth/me', { headers });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          if (data.user.isGuest) {
            sessionStorage.setItem('mainichi_user', JSON.stringify(data.user));
          } else {
            localStorage.setItem('mainichi_user', JSON.stringify(data.user));
          }
        } else if (response.status === 401 || response.status === 403) {
          // Token or cookie expired
          logout();
        }
      } catch (err) {
        console.error("Failed to verify session on mount", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const continueAsGuest = async () => {
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Guest login failed');

      // For standard web, store 'cookie_session' as placeholder. For App Inventor, store the actual JWT.
      const storedToken = IS_APP_INVENTOR ? data.token : 'cookie_session';
      sessionStorage.setItem('mainichi_token', storedToken);
      sessionStorage.setItem('mainichi_user', JSON.stringify(data.user));
      sessionStorage.setItem('mainichi_guest', 'true');
      
      // Initialize basic guest state in sessionStorage
      const defaultStats = {
        current_streak: 0,
        longest_streak: 0,
        last_study_date: null,
        words_mastered: 0,
        mastery_requirement: 10,
        daily_goal: 20
      };
      sessionStorage.setItem('mainichi_guest_stats', JSON.stringify(defaultStats));
      sessionStorage.setItem('mainichi_guest_progress', '{}');
      sessionStorage.setItem('mainichi_guest_completed_lessons', '[]');
      sessionStorage.setItem('mainichi_guest_downloaded_decks', '[1]');
      
      setUser(data.user);
      
      if (IS_APP_INVENTOR) {
        syncGuestProgressToTinyDB();
      }
      return true;
    } catch (error) {
      console.error("Guest login failed", error);
      alert(error.message);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Clear any guest state
      sessionStorage.removeItem('mainichi_token');
      sessionStorage.removeItem('mainichi_user');
      sessionStorage.removeItem('mainichi_guest');
      sessionStorage.removeItem('mainichi_guest_stats');
      sessionStorage.removeItem('mainichi_guest_progress');
      sessionStorage.removeItem('mainichi_guest_completed_lessons');
      sessionStorage.removeItem('mainichi_guest_downloaded_decks');
      clearGuestProgressInTinyDB();

      const storedToken = IS_APP_INVENTOR ? data.token : 'cookie_session';
      localStorage.setItem('mainichi_token', storedToken);
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
      // Gather guest progress if present
      let guestProgress = null;
      const isGuestStr = sessionStorage.getItem('mainichi_guest');
      if (isGuestStr === 'true') {
        const stats = JSON.parse(sessionStorage.getItem('mainichi_guest_stats') || 'null');
        const reviews = JSON.parse(sessionStorage.getItem('mainichi_guest_progress') || 'null');
        const completedLessons = JSON.parse(sessionStorage.getItem('mainichi_guest_completed_lessons') || 'null');
        const unlockedDecks = JSON.parse(sessionStorage.getItem('mainichi_guest_downloaded_decks') || 'null');
        
        if (stats || reviews || completedLessons || unlockedDecks) {
          guestProgress = { stats, reviews, completedLessons, unlockedDecks };
        }
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, guestProgress })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      // Clear guest session data upon successful registration
      sessionStorage.removeItem('mainichi_token');
      sessionStorage.removeItem('mainichi_user');
      sessionStorage.removeItem('mainichi_guest');
      sessionStorage.removeItem('mainichi_guest_stats');
      sessionStorage.removeItem('mainichi_guest_progress');
      sessionStorage.removeItem('mainichi_guest_completed_lessons');
      sessionStorage.removeItem('mainichi_guest_downloaded_decks');
      clearGuestProgressInTinyDB();

      const storedToken = IS_APP_INVENTOR ? data.token : 'cookie_session';
      localStorage.setItem('mainichi_token', storedToken);
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
      const token = localStorage.getItem('mainichi_token') || sessionStorage.getItem('mainichi_token');
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
      if (user?.isGuest) {
        sessionStorage.setItem('mainichi_user', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('mainichi_user', JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error("Update failed", error);
      alert(error.message);
      return false;
    }
  };

  const subscribeUser = async () => {
    try {
      const token = localStorage.getItem('mainichi_token') || sessionStorage.getItem('mainichi_token');
      const response = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Subscription failed');

      if (user?.isGuest) {
        sessionStorage.setItem('mainichi_user', JSON.stringify(data.user));
      } else {
        localStorage.setItem('mainichi_user', JSON.stringify(data.user));
      }
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Subscription failed", error);
      alert(error.message);
      return false;
    }
  };

  const becomeCreator = async () => {
    try {
      const token = localStorage.getItem('mainichi_token') || sessionStorage.getItem('mainichi_token');
      const response = await fetch('/api/user/become-creator', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update creator status');

      if (user?.isGuest) {
        sessionStorage.setItem('mainichi_user', JSON.stringify(data.user));
      } else {
        localStorage.setItem('mainichi_user', JSON.stringify(data.user));
      }
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Failed to update creator status", error);
      alert(error.message);
      return false;
    }
  };

  const logout = () => {
    // Clear cookie on server (fire and forget / non-blocking)
    fetch('/api/auth/logout', { method: 'POST' }).catch(err => console.error("Server logout request failed", err));

    localStorage.removeItem('mainichi_token');
    localStorage.removeItem('mainichi_user');
    sessionStorage.removeItem('mainichi_token');
    sessionStorage.removeItem('mainichi_user');
    sessionStorage.removeItem('mainichi_guest');
    sessionStorage.removeItem('mainichi_guest_stats');
    sessionStorage.removeItem('mainichi_guest_progress');
    sessionStorage.removeItem('mainichi_guest_completed_lessons');
    sessionStorage.removeItem('mainichi_guest_downloaded_decks');
    clearGuestProgressInTinyDB();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      continueAsGuest,
      updateProfile, 
      logout, 
      loading,
      isPremiumModalOpen,
      setIsPremiumModalOpen,
      subscribeUser,
      becomeCreator
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
