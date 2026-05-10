import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [streak, setStreak] = useState(0);
  const [masteredWords, setMasteredWords] = useState(0);
  const [dailyGoal, setDailyGoal] = useState({ current: 0, total: 20 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // SRS implementation would go here or in a separate context/hook
  const recordReview = (wordId, rating) => {
    // rating: 'hard', 'good', 'easy'
    // Update SRS intervals in global state and API
    setDailyGoal(prev => ({ ...prev, current: Math.min(prev.current + 1, prev.total) }));
  };

  return (
    <AppContext.Provider value={{
      streak, setStreak,
      masteredWords, setMasteredWords,
      dailyGoal, setDailyGoal,
      isSidebarOpen, setIsSidebarOpen,
      recordReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
