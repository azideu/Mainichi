import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

const PullToRefresh = ({ children, onRefresh }) => {
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef(null);

  const MAX_PULL = 80;
  const THRESHOLD = 60;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0 && !isRefreshing) {
        setStartY(e.touches[0].clientY);
        containerRef.current.startX = e.touches[0].clientX;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling || isRefreshing) return;
      
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = currentY - startY;
      
      // If user is swiping horizontally more than vertically, ignore
      const diffX = Math.abs(currentX - (containerRef.current.startX || currentX));
      if (diffX > Math.abs(diffY)) {
        setIsPulling(false);
        return;
      }

      if (diffY > 0 && window.scrollY === 0) {
        // Prevent default scrolling when pulling down at the top
        e.preventDefault();
        const distance = Math.min(diffY * 0.4, MAX_PULL); // Adding resistance
        setPullDistance(distance);
        controls.set({ y: distance });
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return;
      setIsPulling(false);

      if (pullDistance >= THRESHOLD) {
        // Trigger refresh
        setIsRefreshing(true);
        controls.start({ y: 50, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          // Reset
          controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
          setPullDistance(0);
        }
      } else {
        // Reset
        controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
        setPullDistance(0);
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isPulling, startY, pullDistance, isRefreshing, onRefresh, controls]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Pull indicator */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none z-40"
        style={{ height: `${MAX_PULL}px`, transform: 'translateY(-100%)' }}
      >
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div 
            animate={controls}
            className="w-10 h-10 bg-surface-container-lowest rounded-full shadow-md flex items-center justify-center text-primary"
          >
            <motion.span 
              key={isRefreshing ? 'spinning' : 'pulling'}
              className="material-symbols-outlined"
              initial={isRefreshing ? { rotate: 0 } : false}
              animate={isRefreshing ? { rotate: 360 } : { rotate: Math.min(pullDistance * 3, 360) }}
              transition={isRefreshing ? { repeat: Infinity, duration: 0.8, ease: "linear" } : { type: "tween", duration: 0 }}
              style={{ 
                opacity: isRefreshing ? 1 : Math.min(pullDistance / THRESHOLD, 1)
              }}
            >
              refresh
            </motion.span>
          </motion.div>
        )}
      </div>
      
      {/* Content */}
      <motion.div animate={controls}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
