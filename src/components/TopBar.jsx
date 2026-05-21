import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import logoNoText from '../assets/logo-no-text.svg';

const TopBar = () => {
  const { setIsSidebarOpen } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      {/* Floating Glassmorphic Container */}
      <div className="bg-surface/80 backdrop-blur-xl border border-outline/10 shadow-paper-layer rounded-2xl flex justify-between items-center w-full px-5 py-2 h-16 relative">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none rounded-2xl overflow-hidden"></div>
        
        {/* Menu Trigger */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="text-primary transition-transform active:scale-95 duration-150 hover:bg-surface-bright p-2 rounded-xl border border-transparent hover:border-outline/10 relative z-10"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>menu_open</span>
        </button>

        {/* Logo */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform group relative z-10"
        >
          <img src={logoNoText} alt="Mainichi" className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Profile Button */}
        <div className="relative z-10">
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="transition-transform active:scale-95 duration-150 rounded-xl overflow-hidden w-10 h-10 border border-outline/20 shadow-sm bg-surface hover:border-primary/30"
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
                {/* Invisible backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-4 w-56 bg-surface-bright rounded-3xl shadow-ambient border border-outline/20 z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-outline/10 bg-surface">
                    <div className="flex items-center gap-2">
                      <p className="font-body-md text-on-surface truncate tracking-wide">{user?.name || 'Wanderer'}</p>
                      {user?.is_premium === 1 && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-label-caps font-bold px-1.5 py-0.5 rounded text-[8px] tracking-wider flex items-center gap-0.5 shadow-sm">
                          <span className="material-symbols-outlined text-[8px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="font-label-caps text-outline text-[10px] truncate mt-1 tracking-widest">{user?.email || 'journey@mainichi.app'}</p>
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-on-surface-variant hover:text-primary hover:bg-surface rounded-xl transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:scale-110" style={{ fontVariationSettings: "'wght' 200" }}>person</span>
                      <span className="font-body-md text-sm">Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 text-on-surface-variant hover:text-primary hover:bg-surface rounded-xl transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-45" style={{ fontVariationSettings: "'wght' 200" }}>settings</span>
                      <span className="font-body-md text-sm">Settings</span>
                    </button>
                    <div className="h-[1px] bg-outline/10 my-1 mx-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 text-outline hover:text-error hover:bg-error/5 rounded-xl transition-colors group"
                    >
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1" style={{ fontVariationSettings: "'wght' 200" }}>logout</span>
                      <span className="font-label-caps tracking-widest">DEPART</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
