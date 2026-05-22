import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';

const Progress = () => {
  const navigate = useNavigate();
  const [deckProgress, setDeckProgress] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const { streak, longestStreak, masteredWords, dailyGoal } = useApp();

  const fetchDecksProgress = async () => {
    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch('/api/progress/decks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDeckProgress(data);
      }
    } catch (err) {
      console.error("Failed to fetch deck progress", err);
    } finally {
      setLoadingDecks(false);
    }
  };

  useEffect(() => {
    fetchDecksProgress();
  }, []);

  const milestones = [
    {
      name: "Daily Seed",
      desc: "Reviewed at least 1 card today",
      icon: "yard",
      check: () => dailyGoal.current >= 1
    },
    {
      name: "Consistent Sprout",
      desc: "Reach a 3-day study streak",
      icon: "spa",
      check: () => streak >= 3
    },
    {
      name: "Cozy Grove",
      desc: "Reach a 7-day study streak",
      icon: "forest",
      check: () => streak >= 7
    },
    {
      name: "First Roots",
      desc: "Master at least 5 words",
      icon: "grass",
      check: () => masteredWords >= 5
    },
    {
      name: "Deep Roots",
      desc: "Master at least 50 words",
      icon: "local_florist",
      check: () => masteredWords >= 50
    },
    {
      name: "Forest Guardian",
      desc: "Master at least 200 words",
      icon: "nature",
      check: () => masteredWords >= 200
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if (loadingDecks) {
    return <LoadingState />;
  }

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="max-w-2xl mx-auto pb-xl"
    >
      {/* Ambient background blur */}
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply z-0"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply z-0"></div>

      {/* Canopy Header */}
      <motion.div variants={itemVariants} className="text-center mb-8 relative z-10">
        <div className="relative flex justify-center items-center mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="md:hidden absolute left-0 w-11 h-11 flex items-center justify-center bg-surface hover:bg-surface-variant text-outline hover:text-primary rounded-xl border border-outline/10 shadow-sm active:scale-95 transition-all duration-200"
            title="Back"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>arrow_back</span>
          </button>
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Your Forest Path</h1>
        </div>
        <p className="font-body-lg text-outline italic">
          "Every day, another leaf grows. Every review, another root deepens."
        </p>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8 relative z-10">
        {/* Current Streak */}
        <div className="bg-surface rounded-2xl p-md border border-outline/10 shadow-paper-layer flex flex-col items-center relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <span className="material-symbols-outlined text-[32px] text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>local_fire_department</span>
          <h3 className="font-h2 text-primary leading-none tracking-tighter">{streak}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[9px] mt-1.5 leading-none">CURRENT STREAK</p>
        </div>

        {/* Longest Streak */}
        <div className="bg-surface rounded-2xl p-md border border-outline/10 shadow-paper-layer flex flex-col items-center relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <span className="material-symbols-outlined text-[32px] text-secondary mb-2" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>emoji_events</span>
          <h3 className="font-h2 text-secondary leading-none tracking-tighter">{longestStreak}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[9px] mt-1.5 leading-none">LONGEST STREAK</p>
        </div>

        {/* Mastered */}
        <div className="bg-surface rounded-2xl p-md border border-outline/10 shadow-paper-layer flex flex-col items-center relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <span className="material-symbols-outlined text-[32px] text-tertiary mb-2" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>verified</span>
          <h3 className="font-h2 text-tertiary leading-none tracking-tighter">{masteredWords}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[9px] mt-1.5 leading-none">WORDS MASTERED</p>
        </div>
      </motion.div>

      {/* Daily Study Intent Card */}
      <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden mb-8 z-10">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-h3 text-on-surface mb-2 tracking-tight">Daily Study Intent</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Consistency builds memory. Complete your daily review goal to nurture your cozy Japanese grove.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'wght' 500" }}>check</span>
              <span className="font-label-caps text-secondary text-[9px] tracking-widest font-bold">
                {dailyGoal.current >= dailyGoal.total ? "GOAL REACHED TODAY!" : `${dailyGoal.total - dailyGoal.current} REVIEWS REMAINING`}
              </span>
            </div>
          </div>
          
          {/* Custom Daily Radial Progress */}
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                className="opacity-10 text-outline" 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="10" 
              />
              <motion.circle 
                className="text-secondary" 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeDasharray="251.2" 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (Math.min(dailyGoal.current / dailyGoal.total, 1) * 251.2) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-h2 text-on-surface tracking-tighter leading-none">{dailyGoal.current}</span>
              <span className="font-label-caps text-outline text-[9px] tracking-widest mt-0.5 font-mono">OF {dailyGoal.total}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Decks Progress Section */}
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <h3 className="font-label-caps text-outline tracking-[0.2em] mb-4 pl-2">ACTIVE DECKS PROGRESS</h3>
        
        {deckProgress.length === 0 ? (
          <div className="bg-surface rounded-2xl p-lg border border-outline/10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            <p className="font-body-md text-outline">You haven't downloaded any decks yet! Visit the Decks portal to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deckProgress.map(deck => {
              const mastered = deck.mastered_count;
              const learning = deck.studied_count - deck.mastered_count;
              const remaining = deck.word_count - deck.studied_count;
              
              const masteredPct = (mastered / deck.word_count) * 100;
              const learningPct = (learning / deck.word_count) * 100;
              
              return (
                <div 
                  key={deck.id} 
                  className="bg-surface rounded-2xl p-5 border border-outline/10 shadow-paper-layer relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
                  
                  <div className="relative z-10 flex justify-between items-start mb-3 gap-4">
                    <div>
                      <h4 className="font-h3 text-on-surface tracking-tight flex items-center gap-2">
                        {deck.title}
                        {deck.is_premium === 1 && (
                          <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                            PREMIUM
                          </span>
                        )}
                      </h4>
                      <p className="font-body-sm text-outline mt-0.5">{deck.description || 'Custom study collection'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-body-sm text-outline tracking-wider font-mono text-[11px] font-bold">
                        {mastered} / {deck.word_count} MASTERED
                      </span>
                    </div>
                  </div>
                  
                  {/* Segmented Horizontal Progress Bar */}
                  <div className="relative z-10 w-full h-3.5 bg-surface-variant rounded-full overflow-hidden flex border border-outline/5 shadow-inner">
                    {/* Mastered Portion */}
                    {masteredPct > 0 && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${masteredPct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-tertiary shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
                        title={`${mastered} mastered`}
                      />
                    )}
                    {/* Learning Portion */}
                    {learningPct > 0 && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${learningPct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: masteredPct > 0 ? 0.2 : 0 }}
                        className="h-full bg-primary shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]"
                        title={`${learning} active learning`}
                      />
                    )}
                  </div>
                  
                  {/* Legend Labels */}
                  <div className="relative z-10 flex justify-between items-center mt-3 text-[10px] font-label-caps text-outline tracking-wider pl-1">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                        <span>Mastered ({mastered})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        <span>Learning ({learning})</span>
                      </div>
                    </div>
                    <div>
                      <span>Remaining ({remaining})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Sticker Book Milestones */}
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <h3 className="font-label-caps text-outline tracking-[0.2em] mb-4 pl-2">JOURNEY MILESTONES</h3>
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-outline/10 shadow-paper-layer relative overflow-hidden">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-6">
            <h4 className="font-h3 text-on-surface tracking-tight mb-1">Your Sticker Book</h4>
            <p className="font-body-md text-outline">Stickers light up as you reach major learning milestones!</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {milestones.map((m, idx) => {
              const isUnlocked = m.check();
              return (
                <motion.div 
                  key={idx}
                  whileHover={isUnlocked ? { scale: 1.03 } : {}}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
                    isUnlocked 
                      ? 'bg-surface-bright border-primary/20 shadow-ambient' 
                      : 'bg-surface-variant/40 border-outline/10 opacity-40 mix-blend-luminosity'
                  }`}
                >
                  <div className="absolute inset-0 bg-washi opacity-10 mix-blend-multiply pointer-events-none"></div>
                  
                  {/* Sticker Badge Circle */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 relative shadow-inner border ${
                    isUnlocked 
                      ? 'bg-primary-container/20 border-primary/30 text-primary shadow-sm' 
                      : 'bg-surface border-outline/20 text-outline'
                  }`}>
                    <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' ${isUnlocked ? 1 : 0}, 'wght' 300` }}>
                      {m.icon}
                    </span>
                    
                    {/* Subtle lock overlay if locked */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/40 rounded-full">
                        <span className="material-symbols-outlined text-[16px] text-outline" style={{ fontVariationSettings: "'wght' 300" }}>lock</span>
                      </div>
                    )}
                  </div>
                  
                  <h5 className="font-label-caps text-on-surface text-center tracking-widest text-[10px] font-bold mb-1 leading-snug">
                    {m.name}
                  </h5>
                  <p className="font-body-sm text-outline text-center text-[10px] leading-tight max-w-[120px]">
                    {m.desc}
                  </p>
                  
                  {/* Sticker unlock effect */}
                  {isUnlocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-yellow-500 rotate-45 transform origin-top-right shadow-sm"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Progress;
