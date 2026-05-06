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
    <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-variant flex items-center justify-between">
      <div>
        <h3 className="font-h3 text-on-surface mb-xs">Mastery</h3>
        <p className="font-body-md text-on-surface-variant">{label}</p>
      </div>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            className="opacity-50 text-surface-variant" 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
          />
          <circle 
            className="text-tertiary transition-all duration-1000 ease-out" 
            cx="50" cy="50" r="40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset} 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-h3 text-on-surface">{progress}</span>
        </div>
      </div>
    </div>
  );
};

export default MasteryRing;
