import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoNoText from '../assets/logo-no-text.svg';

const TopBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="fixed top-0 left-0 md:left-[260px] right-0 z-50 px-4 pt-3 pb-2 md:px-6 md:pt-4">
      {/* Floating Glassmorphic Capsule */}
      <div className="bg-surface/85 backdrop-blur-xl border border-outline/10 shadow-ambient rounded-2xl flex justify-between items-center w-full px-4 h-12 md:h-14 relative">
        {/* Washi texture overlay */}
        <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none rounded-2xl overflow-hidden"></div>

        {/* Left side action trigger and Page Title */}
        <div className="relative z-10 flex items-center gap-2 min-w-[120px]">
          {!isRootPath && (
            <button 
              onClick={() => navigate(-1)}
              className="text-outline hover:text-primary hover:bg-surface-variant/40 p-1.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-outline/10 shrink-0"
              title="Back"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
            </button>
          )}
          <span className="font-label-caps tracking-widest text-[10px] text-primary font-bold truncate max-w-[80px] sm:max-w-none">
            {getPageTitle(location.pathname).toUpperCase()}
          </span>
        </div>

        {/* Centered Brand Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer active:scale-95 transition-transform group pointer-events-auto"
          >
            <img src={logoNoText} alt="Mainichi" className="h-7 md:h-8 w-auto opacity-95 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Right side user avatar button */}
        <div className="relative z-10 flex items-center min-w-[120px] justify-end">
          <button 
            onClick={() => navigate('/profile')}
            className="rounded-full overflow-hidden w-8 h-8 border border-outline/20 shadow-sm bg-surface hover:border-primary/40 active:scale-95 transition-all duration-200 shrink-0 flex items-center justify-center"
            title="View Profile"
          >
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover" 
              src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} 
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
