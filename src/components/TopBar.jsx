import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const TopBar = () => {
  const { setIsSidebarOpen } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'Home';
    if (pathname.startsWith('/lessons')) return 'Lessons';
    if (pathname.startsWith('/review')) return 'Reviews';
    if (pathname.startsWith('/community')) return 'Community';
    if (pathname.startsWith('/profile')) return 'Profile';
    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/progress')) return 'Forest Path';
    if (pathname.startsWith('/flashcard')) return 'Flashcards';
    return 'Mainichi';
  };

  const rootPaths = ['/', '/lessons', '/review', '/community', '/profile'];
  const isRootPath = rootPaths.includes(location.pathname);

  // Don't render TopBar on login screen
  if (location.pathname === '/login') return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-12 md:h-14 bg-surface/85 backdrop-blur-md border-b border-outline/10 px-4 flex justify-between items-center select-none relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none overflow-hidden"></div>

      {/* Left side action trigger */}
      <div className="relative z-10 flex items-center">
        {isRootPath ? (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-primary hover:bg-surface-variant p-2 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
            title="Menu"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>menu</span>
          </button>
        ) : (
          <button 
            onClick={() => navigate(-1)}
            className="text-outline hover:text-primary hover:bg-surface-variant p-2 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
            title="Back"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
          </button>
        )}
      </div>

      {/* Dynamic centered title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <h2 className="font-h2 text-primary font-semibold tracking-tight text-center whitespace-nowrap">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      {/* Right side user avatar */}
      <div className="relative z-10 flex items-center">
        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="rounded-full overflow-hidden w-8 h-8 md:w-9 md:h-9 border border-outline/20 shadow-sm bg-surface hover:border-primary/40 active:scale-95 transition-all duration-200 shrink-0"
        >
          <img 
            alt="User avatar" 
            className="w-full h-full object-cover" 
            src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} 
          />
        </button>

        <AnimatePresence>
          {isProfileMenuOpen && (
            <>
              {/* Overlay backdrop to close dropdown */}
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
              
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-48 bg-surface-bright rounded-2xl shadow-ambient border border-outline/10 z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-outline/10 bg-surface">
                  <p className="font-body-md text-on-surface truncate font-medium text-xs tracking-wide">{user?.name || 'Wanderer'}</p>
                  {user?.is_premium === 1 && (
                    <span className="inline-block bg-tertiary/10 text-tertiary border border-tertiary/20 text-[7px] font-label-caps px-1.5 py-0.5 rounded-full tracking-widest mt-1">
                      PREMIUM
                    </span>
                  )}
                </div>
                <div className="p-1 flex flex-col">
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface rounded-lg transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary" style={{ fontVariationSettings: "'wght' 200" }}>person</span>
                    <span className="font-body-md text-xs">Profile</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface rounded-lg transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary" style={{ fontVariationSettings: "'wght' 200" }}>settings</span>
                    <span className="font-body-md text-xs">Settings</span>
                  </button>
                  <div className="h-[1px] bg-outline/10 my-1 mx-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-outline hover:text-error hover:bg-error/5 rounded-lg transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:text-error" style={{ fontVariationSettings: "'wght' 200" }}>logout</span>
                    <span className="font-label-caps text-[9px] tracking-widest">DEPART</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default TopBar;
