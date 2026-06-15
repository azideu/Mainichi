import React from 'react';
import { motion } from 'framer-motion';

const Button3D = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const isPrimary = variant === 'primary';
  
  // Tactical "Stone" Feel
  const hasCustomPy = className.split(' ').some(c => c.startsWith('py-'));
  const hasCustomPx = className.split(' ').some(c => c.startsWith('px-') || c.startsWith('p-'));
  const hasCustomWidth = className.split(' ').some(c => c.startsWith('w-') || c.startsWith('flex-') || c === 'grow' || c === 'shrink-0');
  const pyStyle = hasCustomPy ? '' : 'py-4';
  const pxStyle = hasCustomPx ? '' : 'px-6';
  const widthStyle = hasCustomWidth ? '' : 'w-full';
  const baseStyle = `font-label-caps text-base ${pyStyle} ${pxStyle} ${widthStyle} flex items-center justify-center gap-3 relative transition-colors duration-300 overflow-hidden group`;
  
  // Add organic rounding and subtle 1px "ink stroke" borders
  const colorStyle = isPrimary 
    ? "bg-primary text-on-primary border border-primary/20 rounded-xl shadow-3d shadow-primary-container"
    : "bg-surface text-on-surface border border-outline/30 rounded-2xl shadow-paper-layer";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, y: 2, boxShadow: isPrimary ? '0 0px 0 rgba(0,0,0,0)' : '0 1px 2px rgba(21, 66, 18, 0.05)' }}
      className={`${baseStyle} ${colorStyle} ${className}`}
      onClick={onClick}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      {...props}
    >
      {/* Ink bleed effect on hover for primary button */}
      {isPrimary && (
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-inherit"></div>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default Button3D;
