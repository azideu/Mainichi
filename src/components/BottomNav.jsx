import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home', path: '/', icon: 'dashboard', label: 'ホーム' },
  { id: 'lessons', path: '/lessons', icon: 'menu_book', label: '授業' },
  { id: 'review', path: '/review', icon: 'auto_stories', label: '復習' },
  { id: 'community', path: '/community', icon: 'groups', label: '交流' },
  { id: 'profile', path: '/profile', icon: 'person', label: 'マイ' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-surface/80 backdrop-blur-xl border border-outline/10 shadow-ambient rounded-2xl h-20 flex justify-around items-center px-4 relative overflow-hidden">
        {/* Washi texture overlay */}
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>

        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center relative flex-1 h-14 transition-all active:scale-90 duration-200 ease-out z-10 ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-pill"
                  className="absolute inset-x-1 inset-y-0 bg-primary/10 rounded-xl border border-primary/10 z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="z-10 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 300" : "'wght' 200" }}>
                  {item.icon}
                </span>
                <span className="font-label-caps text-[9px] mt-1 tracking-widest">{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
