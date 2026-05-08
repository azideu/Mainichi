import React, { useEffect, useState } from 'react';

const MasteryRing = ({ progress = 0, total = 100, label = "Words learned" }) => {
  const [offset, setOffset] = useState(251.2); // 2 * PI * r (r=40)
  const circumference = 251.2;

  useEffect(() => {
    const percentage = Math.min(progress / total, 1);
    const newOffset = circumference - percentage * circumference;
    // Delay animation slightly for effect
    const timeout = setTimeout(() => setOffset(newOffset), 300);
    return () => clearTimeout(timeout);
  }, [progress, total]);

  return (
    <div className="bg-surface rounded-2xl p-md shadow-paper-layer border border-outline/10 flex items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
      <div className="relative z-10">
        <h3 className="font-h3 text-on-surface mb-1 tracking-tight">Mastery</h3>
        <p className="font-body-md text-outline">{label}</p>
      </div>
      <div className="relative w-24 h-24 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="opacity-20 text-outline" 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
          />
          <circle 
            className="text-primary transition-all duration-1000 ease-out" 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-h2 text-on-surface tracking-tighter">{progress}</span>
        </div>
      </div>
    </div>
  );
};

export default MasteryRing;
