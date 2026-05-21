import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';
import { sendToAppInventor, APP_INVENTOR_ACTIONS } from '../utils/appInventorBridge';

const Review = () => {
  const navigate = useNavigate();
  const { isMobileApp } = useApp();
  const [dueCount, setDueCount] = React.useState(0);

  React.useEffect(() => {
    const fetchDue = async () => {
      try {
        const token = localStorage.getItem('mainichi_token');
        const tzOffset = new Date().getTimezoneOffset().toString();
        const res = await fetch(`/api/progress/due?tzOffset=${tzOffset}`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Timezone-Offset': tzOffset
          }
        });
        if (res.ok) {
          const data = await res.json();
          setDueCount(data.length);
        }
      } catch (err) {
        console.error("Failed to fetch due count", err);
      }
    };
    fetchDue();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl mx-auto pb-xl">
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-h1 text-on-surface tracking-tighter">Reviews</h1>
          <p className="font-body-md text-outline tracking-wide">Your daily SRS queue</p>
        </div>
        <div className="w-14 h-14 bg-surface-bright border border-primary/20 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors"></div>
          <span className="font-h2 text-primary relative z-10">{dueCount}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-xl p-lg border border-outline/10 shadow-paper-layer mb-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="font-h2 text-on-surface mb-2 tracking-tight">JLPT N5 Core</h3>
          <p className="font-body-md text-on-surface-variant mb-6">{dueCount} cards due for review</p>
          <Button3D onClick={() => {
            if (isMobileApp) {
              sendToAppInventor(APP_INVENTOR_ACTIONS.VIBRATE, { duration: 100 });
            }
            navigate('/flashcard');
          }} variant="primary" disabled={dueCount === 0}>
            {dueCount > 0 ? 'Commence Review' : 'Nothing Due'}
          </Button3D>
        </div>
      </motion.div>

      <motion.h2 variants={itemVariants} className="font-h3 text-on-surface mb-6 flex items-center gap-4">
        Custom Decks
        <div className="h-[1px] flex-1 bg-outline/20"></div>
      </motion.h2>
      
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Empty state for custom decks */}
        <div className="border border-dashed border-outline/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 hover:bg-surface/50 transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4 group-hover:scale-110 transition-transform duration-500 ease-out" style={{ fontVariationSettings: "'wght' 200" }}>note_add</span>
          <p className="font-label-caps tracking-widest text-outline">CREATE DECK</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Review;
