import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import logoNoText from '../assets/logo-no-text.svg';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Lessons', icon: 'menu_book', path: '/lessons' },
    { name: 'Review', icon: 'auto_stories', path: '/review' },
    { name: 'Community', icon: 'groups', path: '/community' },
    { name: 'Settings', icon: 'settings', path: '/settings' },
  ];

  const activeIndex = navItems.findIndex((item) => 
    location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  return (
    <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[260px] bg-surface z-[40] shadow-ambient flex-col border-r border-outline/10 overflow-hidden">
      {/* Subtle Washi Texture Overlay */}
      <div className="absolute inset-0 bg-washi opacity-40 pointer-events-none mix-blend-multiply"></div>

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header: Editorial & Minimal */}
        <div className="flex items-center justify-between mb-8">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <img src={logoNoText} alt="Mainichi" className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:scale-[1.02]" />
          </div>
        </div>

        {/* Navigation: Floating Items */}
        <nav className="flex-1 flex flex-col gap-2 relative">
          {/* Persistent Hardware-Accelerated Active Indicator Pill */}
          {activeIndex !== -1 && (
            <div 
              className="absolute left-0 right-0 h-12 bg-primary/10 rounded-2xl border border-primary/10 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
              style={{
                transform: `translateY(${activeIndex * 56}px)`
              }}
            />
          )}

          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 h-12 transition-colors duration-300 group rounded-2xl overflow-hidden ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-[24px] z-10 transition-transform duration-500 ${isActive ? '' : 'group-hover:-translate-y-0.5'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 300" : "'wght' 200" }}>
                  {item.icon}
                </span>
                <span className="font-body-lg z-10 tracking-wide text-xs">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: User Profile */}
        <div className="mt-auto pt-6 border-t border-outline/10">
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 mb-4 p-3 bg-surface-container-low rounded-xl border border-outline/10 shadow-paper-layer cursor-pointer hover:border-primary/20 transition-all"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline/20 shrink-0">
              <img src={user?.profile_picture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-on-surface truncate font-medium text-[11px]">{user?.name || 'Wanderer'}</p>
              <p className="font-label-caps text-outline text-[8px] truncate mt-0.5 tracking-widest">{user?.email || 'journey@mainichi.app'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-outline hover:text-error font-label-caps tracking-widest text-[9px] transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-0.5 transition-transform text-[16px]" style={{ fontVariationSettings: "'wght' 200" }}>logout</span>
            DEPART
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
