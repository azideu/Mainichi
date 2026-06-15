import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet, useOutlet } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import Kana from './pages/Kana';
import Review from './pages/Review';
import Progress from './pages/Progress';
import Community from './pages/Community';
import Flashcard from './pages/Flashcard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DevSandbox from './pages/DevSandbox';
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

const FrozenRoute = ({ children }) => {
  const [frozen] = useState(children);
  return frozen;
};

const AppLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const { isPremiumModalOpen, setIsPremiumModalOpen } = useAuth();
  const { isOffline } = useApp();
  
  return (
    <div className="bg-background text-on-background pb-[84px] md:pb-xl font-body-md min-h-screen relative overflow-x-hidden md:pl-[260px]">
      <Sidebar />
      <TopBar />
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 md:left-[260px] z-[9999] bg-error text-on-error py-2 px-4 text-center font-label-caps tracking-widest text-[9px] flex items-center justify-center gap-2 shadow-md animate-in slide-in-from-top duration-300">
          <span className="material-symbols-outlined text-[14px] animate-pulse">wifi_off</span>
          Offline Mode — Progress will sync when connection returns
        </div>
      )}
      <main className={`px-4 sm:px-md ${isOffline ? 'pt-[96px] md:pt-[116px]' : 'pt-[72px] md:pt-[88px]'} pb-4 md:pb-xl transition-all duration-300`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FrozenRoute>
              {outlet}
            </FrozenRoute>
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
            
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/kana" element={<Kana />} />
              <Route path="/review" element={<Review />} />
              <Route path="/flashcard" element={<Flashcard />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/sandbox" element={<DevSandbox />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
