import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Review from './pages/Review';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Flashcard from './pages/Flashcard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import PremiumSubscriptionModal from './components/PremiumSubscriptionModal';
import LoadingState from './components/LoadingState';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState fullScreen={true} message="Checking authentication..." />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';

const AppLayout = ({ children }) => {
  const location = useLocation();
  const { isPremiumModalOpen, setIsPremiumModalOpen } = useAuth();
  
  return (
    <div className="bg-background text-on-background pb-[84px] md:pb-xl font-body-md min-h-screen relative overflow-x-hidden md:pl-[260px]">
      <Sidebar />
      <TopBar />
      <main className="px-4 sm:px-md pt-[72px] md:pt-[88px] pb-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <PremiumSubscriptionModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />
    </div>
  );
};


import { initAppInventorListener } from './utils/appInventorBridge';
import { useApp } from './context/AppContext';

const AppGlobalListener = () => {
  const { handleAppInventorData } = useApp();
  
  React.useEffect(() => {
    initAppInventorListener((data) => {
      console.log("Data received from App Inventor:", data);
      handleAppInventorData(data);
    });
  }, [handleAppInventorData]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppGlobalListener />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute><AppLayout><Lessons /></AppLayout></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><AppLayout><Review /></AppLayout></ProtectedRoute>} />
            <Route path="/flashcard" element={<ProtectedRoute><AppLayout><Flashcard /></AppLayout></ProtectedRoute>} />
            <Route path="/progress" element={<ProtectedRoute><AppLayout><Progress /></AppLayout></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><AppLayout><Community /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
