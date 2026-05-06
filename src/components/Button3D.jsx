import React from 'react';
import { motion } from 'framer-motion';

const Button3D = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const isPrimary = variant === 'primary';
  
  const baseStyle = "font-h3 text-base py-3 px-4 rounded-lg flex items-center justify-center gap-2 relative w-full";
  
  const colorStyle = isPrimary 
    ? "bg-primary text-on-primary shadow-[0_4px_0_#6a2d00]" // uses on-primary-container or darker shade for shadow
    : "bg-surface-container text-on-surface shadow-[0_4px_0_#d8dadc]"; // surface-dim
    
  return (
    <motion.button
      whileTap={{ y: 4, boxShadow: '0 0px 0 rgba(0,0,0,0)' }}
      className={`${baseStyle} ${colorStyle} ${className}`}
      onClick={onClick}
      style={{
        // WebViewer optimization: disable native tap highlight
        WebkitTapHighlightColor: 'transparent',
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button3D;
