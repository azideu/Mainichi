import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
          />
          
          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-surface-container-lowest z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-md border-b border-surface-variant flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                </div>
                <h2 className="font-h3 text-primary">Mainichi</h2>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-md">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-md px-md py-sm hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all group"
                >
                  <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="font-body-lg">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-md border-t border-surface-variant bg-surface-container-low">
              <div className="flex items-center gap-md mb-md">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container">
                  <img src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} alt="User" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md font-bold text-on-surface truncate">{user?.name || 'User'}</p>
                  <p className="font-label-caps text-on-surface-variant text-[10px] truncate">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-sm py-sm bg-surface-variant text-error font-button-text rounded-lg hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                Logout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
