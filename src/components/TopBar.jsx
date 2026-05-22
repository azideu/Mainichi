import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import logoNoText from '../assets/logo-no-text.svg';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

        {/* Left side action trigger */}
        <div className="relative z-10 flex items-center min-w-[40px]">
          {!isRootPath && (
            <button 
              onClick={() => navigate(-1)}
              className="text-outline hover:text-primary hover:bg-surface-variant/40 p-2 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-outline/10"
              title="Back"
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
            </button>
          )}
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

        {/* Right side alignment spacer */}
        <div className="relative z-10 flex items-center min-w-[40px]">
          {/* Kept empty to ensure beautiful symmetric centering of the brand logo */}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
