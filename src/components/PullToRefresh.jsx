import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const PullToRefresh = ({ children, onRefresh }) => {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const controls = useAnimation();
  const containerRef = useRef(null);

  const MAX_PULL = 80;
  const THRESHOLD = 60;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;
      
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && window.scrollY === 0) {
        // Prevent default scrolling when pulling down at the top
        e.preventDefault();
        const distance = Math.min(diff * 0.4, MAX_PULL); // Adding resistance
        setPullDistance(distance);
        controls.set({ y: distance });
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;
      setIsPulling(false);

      if (pullDistance >= THRESHOLD) {
        // Trigger refresh
        controls.start({ y: 50, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        await onRefresh();
      }
      
      // Reset
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
      setPullDistance(0);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, startY, pullDistance, onRefresh, controls]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center overflow-hidden pointer-events-none"
        style={{ height: `${MAX_PULL}px`, transform: 'translateY(-100%)' }}
      >
        <motion.div 
          animate={controls}
          className="w-10 h-10 bg-surface-container-lowest rounded-full shadow-md flex items-center justify-center text-primary"
        >
          <span 
            className="material-symbols-outlined"
            style={{ 
              transform: `rotate(${Math.min(pullDistance * 3, 360)}deg)`,
              opacity: Math.min(pullDistance / THRESHOLD, 1)
            }}
          >
            refresh
          </span>
        </motion.div>
      </div>
      
      {/* Content */}
      <motion.div animate={controls}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
