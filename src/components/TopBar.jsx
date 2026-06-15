import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

import logoNoText from '../assets/logo-no-text.svg';

const TopBar = () => {
  const { user } = useAuth();
  const { streak } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'ホーム';
    if (pathname.startsWith('/lessons')) return '授業';
    if (pathname.startsWith('/kana')) return '仮名';
    if (pathname.startsWith('/review')) return '復習';
    if (pathname.startsWith('/community')) return '交流';
    if (pathname.startsWith('/profile')) return 'マイ';
    if (pathname.startsWith('/settings')) return '設定';
    if (pathname.startsWith('/progress')) return '進捗';
    if (pathname.startsWith('/flashcard')) return '単語カード';
    return 'Mainichi';
  };

  const rootPaths = ['/', '/lessons', '/kana', '/review', '/community', '/profile'];
  const isRootPath = rootPaths.includes(location.pathname);

  // Don't render TopBar on login screen
  if (location.pathname === '/login') return null;

  return (
    <header className="fixed top-0 left-0 md:left-[260px] right-0 z-50 px-4 pt-[calc(8px+var(--notch-gap))] pb-2 md:px-6 md:pt-4">
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

        {/* Centered User Streak with Fire Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div 
            onClick={() => navigate('/progress')}
            className="flex items-center gap-1 cursor-pointer active:scale-95 transition-transform group pointer-events-auto bg-primary/5 hover:bg-primary/10 px-3 py-1 rounded-full border border-primary/10 shadow-sm"
            title="Forest Path (Streak)"
          >
            <span className="material-symbols-outlined text-primary text-[20px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}>local_fire_department</span>
            <span className="font-label-caps text-primary font-bold text-[12px] tracking-wider">{streak}</span>
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
