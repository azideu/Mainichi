import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-xl">
      <div className="relative w-16 h-16 mb-4">
        <motion.div
          className="absolute inset-0 border-4 border-surface-variant rounded-full"
          style={{ borderTopColor: 'var(--color-primary)' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 border-4 border-transparent rounded-full"
          style={{ borderTopColor: 'var(--color-secondary)' }}
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
      <p className="font-label-caps text-on-surface-variant animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      {content}
    </div>
  );
};

export default LoadingState;
