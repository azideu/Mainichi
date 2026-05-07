import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

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
    <header className="bg-surface-container-lowest border-b border-surface-variant shadow-sm flex justify-between items-center w-full px-5 py-3 h-16 z-50 fixed top-0 left-0 right-0">
      {/* Menu Trigger */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="text-primary transition-transform active:scale-95 duration-150 hover:bg-surface-container p-2 rounded-full"
      >
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>

      {/* Logo */}
      <div 
        onClick={() => navigate('/')}
        className="flex items-center gap-xs cursor-pointer active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        <h1 className="text-primary font-h3 tracking-tight">Mainichi</h1>
      </div>

      {/* Profile Button */}
      <div className="relative">
        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="transition-transform active:scale-95 duration-150 rounded-full overflow-hidden w-9 h-9 border-2 border-primary-container shadow-sm bg-surface-container"
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
                className="absolute right-0 mt-3 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-variant z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-surface-variant">
                  <p className="font-body-md font-bold text-on-surface truncate">{user?.name || 'User'}</p>
                  <p className="font-label-caps text-on-surface-variant text-[10px] truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    View Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    Account Settings
                  </button>
                  <div className="h-[1px] bg-surface-variant my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg transition-colors text-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Logout
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
