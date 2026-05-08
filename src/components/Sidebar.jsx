import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Lessons', icon: 'menu_book', path: '/lessons' },
    { name: 'Review', icon: 'auto_stories', path: '/review' },
    { name: 'Community', icon: 'groups', path: '/community' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Natural 'Fog' Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-[#191c18]/30 z-[60] backdrop-blur-md"
          />
          
          {/* Architectural Void Sidebar Panel */}
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-surface z-[70] shadow-ambient flex flex-col rounded-r-organic-3 border-r border-outline/20 overflow-hidden"
          >
            {/* Subtle Washi Texture Overlay */}
            <div className="absolute inset-0 bg-washi opacity-40 pointer-events-none mix-blend-multiply"></div>

            <div className="relative z-10 flex flex-col h-full p-lg">
              {/* Header: Editorial & Minimal */}
              <div className="flex items-center justify-between mb-xl">
                <div className="flex items-center gap-sm group">
                  <div className="w-12 h-12 border border-primary/20 rounded-xl flex items-center justify-center bg-surface-bright shadow-paper-layer transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'wght' 200, 'FILL' 1" }}>energy_savings_leaf</span>
                  </div>
                  <h2 className="font-h2 text-primary tracking-tighter">Mainichi</h2>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant rounded-full transition-colors text-outline"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
                </button>
              </div>

              {/* Navigation: Floating Items */}
              <nav className="flex-1 flex flex-col gap-sm">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`relative flex items-center gap-md px-md py-sm transition-all duration-300 group overflow-hidden ${
                        isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      {/* Active State Ink Bleed */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeNavIndicator"
                          className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/10"
                        />
                      )}
                      
                      <span className={`material-symbols-outlined text-[26px] z-10 transition-transform duration-500 ${isActive ? '' : 'group-hover:-translate-y-1'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 300" : "'wght' 200" }}>
                        {item.icon}
                      </span>
                      <span className="font-body-lg z-10 tracking-wide">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer: User Profile */}
              <div className="mt-auto pt-lg border-t border-outline/20">
                <div className="flex items-center gap-sm mb-md p-sm bg-surface-container-low rounded-xl border border-outline/10 shadow-paper-layer">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-outline/30">
                    <img src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-on-surface truncate">{user?.name || 'Wanderer'}</p>
                    <p className="font-label-caps text-outline text-[10px] truncate mt-1 tracking-widest">{user?.email || 'journey@mainichi.app'}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-sm py-sm text-outline hover:text-error font-label-caps tracking-widest transition-colors group"
                >
                  <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 200" }}>logout</span>
                  DEPART
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
