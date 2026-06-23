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
      className="max-w-4xl mx-auto pb-6 md:pb-xl px-2 sm:px-4 relative"
    >
      {/* Background Grid & Guidelines */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(86,125,70,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Canopy Header */}
      <motion.div variants={itemVariants} className="mb-4 md:mb-8 relative z-10 hidden md:block">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={() => navigate(-1)}
            className="md:hidden w-11 h-11 flex items-center justify-center bg-surface hover:bg-surface-variant text-outline hover:text-primary rounded-xl border border-outline/10 shadow-sm active:scale-95 transition-all duration-200 shrink-0"
            title="Back"
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>arrow_back</span>
          </button>
          <h1 className="font-h1 !text-3xl text-primary mb-1">Your Forest Path</h1>
        </div>
        <p className="font-body-lg text-outline italic">
          "Every day, another leaf grows. Every review, another root deepens."
        </p>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-8 relative z-10">
        {/* Current Streak */}
        <div className="card-premium !p-4 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>local_fire_department</span>
          </div>
          <h3 style={{ fontWeight: 400 }} className="text-2xl text-primary leading-none">{streak}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[8px] mt-2 leading-none font-bold">CURRENT STREAK</p>
        </div>

        {/* Longest Streak */}
        <div className="card-premium !p-4 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary border border-secondary/20 mb-2">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>emoji_events</span>
          </div>
          <h3 style={{ fontWeight: 400 }} className="text-2xl text-secondary leading-none">{longestStreak}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[8px] mt-2 leading-none font-bold">LONGEST STREAK</p>
        </div>

        {/* Mastered */}
        <div className="card-premium !p-4 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/20 mb-2">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>verified</span>
          </div>
          <h3 style={{ fontWeight: 400 }} className="text-2xl text-tertiary leading-none">{masteredWords}</h3>
          <p className="font-label-caps text-outline tracking-wider text-[8px] mt-2 leading-none font-bold">WORDS ROOTED</p>
        </div>
      </motion.div>

      {/* Daily Study Intent Card */}
      <motion.div variants={itemVariants} className="card-premium mb-6 md:mb-8 z-10">
        <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="block w-4 h-px bg-primary/45 shrink-0" />
              <span
                className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-bold"
              >
                Daily Study Intent
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant/80 text-[11px] leading-relaxed">
              Consistency builds memory. Complete your daily review goal to nurture your cozy Japanese grove.
            </p>
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/20">
              <span className="material-symbols-outlined text-[12px] text-secondary" style={{ fontVariationSettings: "'wght' 500" }}>check</span>
              <span className="font-label-caps text-secondary text-[8px] tracking-widest font-bold">
                {dailyGoal.current >= dailyGoal.total ? "GOAL REACHED TODAY!" : `${dailyGoal.total - dailyGoal.current} REVIEWS REMAINING`}
              </span>
            </div>
          </div>
          
          {/* Custom Daily Radial Progress */}
          <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                className="opacity-10 text-outline" 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
              />
              <motion.circle 
                className="text-secondary" 
                cx="50" cy="50" r="40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="8" 
                strokeLinecap="round" 
                strokeDasharray="251.2" 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (Math.min(dailyGoal.current / dailyGoal.total, 1) * 251.2) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontWeight: 400 }} className="text-xl text-on-surface tracking-tighter leading-none">{dailyGoal.current}</span>
              <span className="font-label-caps text-outline text-[8px] tracking-widest mt-0.5 font-mono">OF {dailyGoal.total}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Active Decks Progress Section */}
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <span className="block w-4 h-px bg-primary/45 shrink-0" />
          <span
            className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-bold"
          >
            Active Decks Progress
          </span>
        </div>
        
        {deckProgress.length === 0 ? (
          <div className="card-premium text-center">
            <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
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
                  className="card-premium group"
                >
                  <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
                  
                  <div className="relative z-10 flex justify-between items-start mb-3 gap-4">
                    <div>
                      <h4 className="font-h2 text-lg text-on-surface tracking-tight flex items-center gap-2">
                        {deck.title}
                        {deck.is_premium === 1 && (
                          <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                            PREMIUM
                          </span>
                        )}
                      </h4>
                      <p className="font-body-sm text-outline/80 mt-0.5 text-xs">{deck.description || 'Custom study collection'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-body-sm text-outline tracking-wider font-mono text-[10px] font-bold">
                        {mastered} / {deck.word_count} MASTERED
                      </span>
                    </div>
                  </div>
                  
                  {/* Segmented Horizontal Progress Bar */}
                  <div className="relative z-10 w-full h-2.5 bg-surface-variant rounded-full overflow-hidden flex border border-outline/5 shadow-inner">
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
                        title={`${learning} learning`}
                      />
                    )}
                    {/* Remaining Portion */}
                    {remaining > 0 && (
                      <div 
                        className="h-full bg-surface-variant flex-1"
                        title={`${remaining} remaining`}
                      />
                    )}
                  </div>
                  
                  {/* Legend Labels */}
                  <div className="relative z-10 flex justify-between items-center mt-3 text-[9px] font-label-caps text-outline/80 tracking-wider pl-1 font-bold">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary" />
                        <span>Mastered ({mastered})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
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

      {/* Stickers Milestones Section */}
      <motion.div variants={itemVariants} className="mb-16 relative z-10">
        <div className="flex items-center gap-2 mb-4 pl-1">
          <span className="block w-4 h-px bg-primary/45 shrink-0" />
          <span
            className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-bold"
          >
            Sticker Book Milestones
          </span>
        </div>

        <div className="card-premium">
          <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
          
          <div className="relative z-10 text-center mb-5">
            <h4 className="font-h2 text-xl text-on-surface mb-0.5">Your Sticker Book</h4>
            <p className="font-body-md text-outline/80 text-xs">Stickers light up as you reach major learning milestones!</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-3">
            {milestones.map((m, idx) => {
              const isUnlocked = m.check();
              return (
                <motion.div 
                  key={idx}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-500 relative overflow-hidden ${
                    isUnlocked 
                      ? 'bg-surface border-primary/20 shadow-sm' 
                      : 'bg-surface-variant/40 border-outline/10 opacity-45 mix-blend-luminosity'
                  }`}
                >
                  <div className="absolute inset-0 bg-washi opacity-10 pointer-events-none rounded-xl" />
                  
                  {/* Sticker Badge Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2.5 relative border ${
                    isUnlocked 
                      ? 'bg-primary-container/20 border-primary/25 text-primary' 
                      : 'bg-surface border-outline/15 text-outline'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' ${isUnlocked ? 1 : 0}, 'wght' 200` }}>
                      {m.icon}
                    </span>
                    
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/40 rounded-full">
                        <span className="material-symbols-outlined text-[12px] text-outline opacity-60" style={{ fontVariationSettings: "'wght' 300" }}>lock</span>
                      </div>
                    )}
                  </div>
                  
                  <h5
                    className="text-on-surface text-center tracking-wider text-[8px] font-bold mb-1 leading-snug"
                  >
                    {m.name}
                  </h5>
                  <p
                    className="text-outline/80 text-center text-[8px] leading-tight max-w-[100px]"
                  >
                    {m.desc}
                  </p>
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
