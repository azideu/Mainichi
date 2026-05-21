import React from 'react';
import { motion } from 'framer-motion';

const HankoStamp = ({ text = "認定", size = 80, className = "" }) => {
  // traditional red cinnabar stamp color: 'rgba(196, 40, 27, 0.9)'
  return (
    <motion.div
      initial={{ scale: 3, opacity: 0, rotate: -45 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: -12,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 20,
          opacity: { duration: 0.15 } 
        } 
      }}
      className={`relative inline-flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Red Outer Ring */}
      <div 
        className="absolute inset-0 rounded-full border-4 border-error/80 flex items-center justify-center"
        style={{
          boxShadow: 'inset 0 0 4px rgba(239, 68, 68, 0.2), 0 2px 8px rgba(239, 68, 68, 0.15)',
          background: 'rgba(253, 244, 245, 0.85)',
          borderColor: '#C23A2B', // Traditional cinnabar ink color
        }}
      >
        {/* Ink Texture Overlay (creates subtle stamp imperfections) */}
        <div className="absolute inset-0 bg-washi opacity-60 mix-blend-multiply rounded-full"></div>
        <div 
          className="absolute inset-1 rounded-full border border-dashed border-[#C23A2B]/40 opacity-70"
        ></div>
        
        {/* Cinnabar Text */}
        <span 
          className="font-bold relative z-10 leading-none text-center select-none"
          style={{
            fontFamily: "'Noto Serif JP', 'Georgia', serif",
            color: '#C23A2B',
            fontSize: size * 0.28,
            letterSpacing: '0.05em',
            writingMode: 'vertical-rl', // Authentic Japanese top-down writing
            textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)',
            filter: 'blur(0.2px)', // Gives that organic, pressed bleed look
          }}
        >
          {text}
        </span>
      </div>

      {/* Ink splats decoration (subtle micro-details) */}
      <div 
        className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-[#C23A2B] opacity-50 filter blur-[0.5px]"
      ></div>
      <div 
        className="absolute -left-1.5 -bottom-0.5 w-1 h-1 rounded-full bg-[#C23A2B] opacity-40 filter blur-[0.4px]"
      ></div>
    </motion.div>
  );
};

export default HankoStamp;
