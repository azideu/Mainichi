import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { IS_APP_INVENTOR, getFromTinyDB } from '../utils/appInventorBridge';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const [streak, setStreak] = useState(0);
  const [masteredWords, setMasteredWords] = useState(0);
  const [masteryRequirement, setMasteryRequirement] = useState(10);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, total: 20 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(true);
  const [isMobileApp] = useState(IS_APP_INVENTOR);

  const handleAppInventorData = React.useCallback((payload) => {
    switch (payload.action) {
      case 'TINYDB_RESPONSE':
        console.log('Received cached progress from TinyDB:', payload.data);
        // Process offline sync data here
        break;
      case 'SENSOR_DATA':
        console.log('Received sensor data (e.g. shake to shuffle):', payload.data);
        break;
      default:
        console.log('Unhandled App Inventor action:', payload.action);
    }
  }, []);
  
  const fetchStats = async () => {
    try {
      setIsFetchingStats(true);
      
      if (isMobileApp) {
        console.log('Checking TinyDB for cached stats before fetching from server...');
        getFromTinyDB('user_stats');
      }

      const token = localStorage.getItem('mainichi_token');
      if (!token) {
        setIsFetchingStats(false);
        return;
      }
      const res = await fetch('/api/progress/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 401 || res.status === 403) {
        logout();
        setIsFetchingStats(false);
        return;
      }
      
      if (res.ok) {
        const data = await res.json();
        setStreak(data.streak);
        setMasteredWords(data.masteredWords);
        setMasteryRequirement(data.masteryRequirement || 10);
        setDailyGoal(prev => ({ current: data.dailyGoal.current, total: data.dailyGoal.total }));
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setIsFetchingStats(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const updateSettings = async (newMasteryReq, newDailyGoal) => {
    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch('/api/progress/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ masteryRequirement: newMasteryReq, dailyGoal: newDailyGoal })
      });
      
      if (res.status === 401 || res.status === 403) {
        logout();
        return false;
      }
      
      if (res.ok) {
        setMasteryRequirement(newMasteryReq);
        setDailyGoal(prev => ({ ...prev, total: newDailyGoal }));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const recordReview = async (wordId, rating) => {
    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch('/api/progress/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ vocab_id: wordId, rating })
      });
      
      if (res.status === 401 || res.status === 403) {
        logout();
        return null;
      }
      
      if (res.ok) {
        const data = await res.json();
        if (data.streak !== undefined) setStreak(data.streak);
        if (data.masteredWords !== undefined) setMasteredWords(data.masteredWords);
        setDailyGoal(prev => ({ ...prev, current: Math.min(prev.current + 1, prev.total) }));
        return data;
      }
      return null;
    } catch (err) {
      console.error("Failed to record review", err);
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      streak, setStreak,
      masteredWords, setMasteredWords,
      masteryRequirement, setMasteryRequirement,
      dailyGoal, setDailyGoal,
      isSidebarOpen, setIsSidebarOpen,
      isFetchingStats,
      isMobileApp,
      handleAppInventorData,
      recordReview,
      updateSettings,
      fetchStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
