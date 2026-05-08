import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-xl">
      <motion.div
        animate={{ 
          y: [-10, 10, -10],
          rotate: [-5, 5, -5]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "easeInOut" 
        }}
        className="w-20 h-20 bg-surface border border-primary/20 rounded-2xl shadow-paper-layer flex items-center justify-center mb-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/5"></div>
        <span className="material-symbols-outlined text-[40px] text-primary relative z-10" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>energy_savings_leaf</span>
      </motion.div>
      <p className="font-label-caps tracking-[0.2em] text-outline animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-surface/80 backdrop-blur-md z-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center relative">
      {content}
    </div>
  );
};

export default LoadingState;
