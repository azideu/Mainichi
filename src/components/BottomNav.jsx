import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home', path: '/', icon: 'dashboard', label: 'Home' },
  { id: 'lessons', path: '/lessons', icon: 'menu_book', label: 'Lessons' },
  { id: 'review', path: '/review', icon: 'rebase_edit', label: 'Review' },
  { id: 'community', path: '/community', icon: 'groups', label: 'Community' },
  { id: 'progress', path: '/progress', icon: 'auto_graph', label: 'Progress' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-surface-container-lowest/90 backdrop-blur-md border-t border-surface-variant shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pt-2 pb-safe-offset-2 h-20 md:hidden">
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        
        return (
          <button 
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center relative w-16 h-12 transition-all active:scale-90 duration-200 ease-out ${
              isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute inset-0 bg-primary-fixed rounded-xl z-0"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="z-10 flex flex-col items-center justify-center pt-1">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-label-caps text-[10px] mt-1">{item.label}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
