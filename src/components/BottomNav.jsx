import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home', path: '/', icon: 'home', label: 'ホーム' },
  { id: 'lessons', path: '/lessons', icon: 'menu_book', label: '授業' },
  { id: 'review', path: '/review', icon: 'style', label: '復習' },
  { id: 'community', path: '/community', icon: 'groups', label: '交流' },
  { id: 'profile', path: '/profile', icon: 'person', label: 'マイ' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0, time: 0 });

  const activeIndex = NAV_ITEMS.findIndex((item) => 
    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.time) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStart.x;
    const diffY = touch.clientY - touchStart.y;
    const timeElapsed = Date.now() - touchStart.time;

    // Swipe criteria: horizontal shift > 50px, vertical deviation < 40px, time < 300ms
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 40 && timeElapsed < 300) {
      if (activeIndex !== -1) {
        if (diffX < 0) {
          // Swipe Left -> Go to next page
          const nextIndex = Math.min(activeIndex + 1, NAV_ITEMS.length - 1);
          if (nextIndex !== activeIndex) {
            navigate(NAV_ITEMS[nextIndex].path);
          }
        } else {
          // Swipe Right -> Go to previous page
          const prevIndex = Math.max(activeIndex - 1, 0);
          if (prevIndex !== activeIndex) {
            navigate(NAV_ITEMS[prevIndex].path);
          }
        }
      }
    }
    setTouchStart({ x: 0, y: 0, time: 0 });
  };

  return (
    <nav 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed bottom-4 left-4 right-4 z-50 md:hidden touch-none select-none"
    >
      <div className="bg-surface/80 backdrop-blur-xl border border-outline/10 shadow-ambient rounded-2xl h-16 flex justify-around items-center px-4 relative overflow-hidden">
        {/* Washi texture overlay */}
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>

        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <button 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center relative flex-1 h-12 transition-[color,background-color,transform] active:scale-90 duration-200 ease-out z-10 ${
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
              <div className="z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 300" : "'wght' 200" }}>
                  {item.icon}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
