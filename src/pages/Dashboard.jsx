import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MasteryRing from '../components/MasteryRing';
import Button3D from '../components/Button3D';
import PullToRefresh from '../components/PullToRefresh';
import LoadingState from '../components/LoadingState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

import logoNoText from '../assets/logo-no-text.svg';

import { LESSONS } from '../constants/lessons';

const Dashboard = () => {
  const { streak, masteredWords, dailyGoal, fetchStats, isFetchingStats } = useApp();
  const { user, setIsPremiumModalOpen } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const [completedLessons, setCompletedLessons] = useState([]);
  const [dueCount, setDueCount] = useState(0);
  const [isDueLoading, setIsDueLoading] = useState(true);
  const [deckTitle, setDeckTitle] = useState('Main Deck');

  const fetchDueCount = async () => {
    try {
      const token = localStorage.getItem('mainichi_token');
      if (!token) return;

      // Fetch all decks to get the actual name of the main deck (id = 1)
      const decksRes = await fetch('/api/decks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (decksRes.ok) {
        const allDecks = await decksRes.json();
        const mainDeck = allDecks.find(d => d.id === 1);
        if (mainDeck && mainDeck.title) {
          setDeckTitle(mainDeck.title);
        }
      }

      const tzOffset = new Date().getTimezoneOffset().toString();
      const res = await fetch(`/api/progress/due?tzOffset=${tzOffset}&deckId=1`, {
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
      console.error("Failed to fetch due count on dashboard", err);
    } finally {
      setIsDueLoading(false);
    }
  };

  useEffect(() => {
    const loadCompletedLessons = async () => {
      // First load from localStorage for instant display
      const saved = localStorage.getItem('mainichi_completed_lessons');
      if (saved) {
        try {
          setCompletedLessons(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse completed lessons", e);
        }
      }

      // Then fetch from server to sync/override
      try {
        const token = localStorage.getItem('mainichi_token');
        if (!token) return;
        const res = await fetch('/api/lessons/completed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCompletedLessons(data);
          localStorage.setItem('mainichi_completed_lessons', JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to fetch completed lessons from backend", err);
      }
    };

    loadCompletedLessons();
    fetchDueCount();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStats(), fetchDueCount()]);
    // Simulate extra visual weight for the refresh
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsRefreshing(false);
  };

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if ((isFetchingStats || isDueLoading) && !isRefreshing) {
    return <LoadingState />;
  }

  const renderStreakCard = (isCompact = false) => {
    return (
      <div className={`card-premium bg-surface-bright group ${isCompact ? '!p-4' : '!p-6'}`}>
        <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
        
        {/* Decorative Japanese element as absolute watermark */}
        <div
          className="absolute right-2 bottom-0 opacity-[0.05] pointer-events-none select-none text-primary"
          style={{
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
            fontSize: '90px',
            fontWeight: 700,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          道
        </div>

        <div className="relative z-10 text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="block w-4 h-px bg-primary/45 shrink-0" />
            <span
              className="text-primary/75 tracking-[0.2em] uppercase text-[9px]"
            >
              DAILY STREAK
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              style={{ fontWeight: 300, lineHeight: 1 }}
              className="text-[4rem] text-primary"
            >
              {streak}
            </span>
            <span
              className="text-primary/70 text-base italic font-normal"
            >
              {streak === 1 ? 'day active' : 'days active'}
            </span>
          </div>
          
          <p
            className="text-[10px] text-on-surface-variant/80 mt-2 leading-relaxed"
          >
            {streak > 0 ? "The forest grows stronger with your consistency. Keep tending to your journey." : "Plant the first seed of your learning journey today."}
          </p>
        </div>
      </div>
    );
  };

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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto pb-6 md:pb-xl relative px-2 sm:px-4"
      >
        {/* Background Grid & Guidelines */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(86,125,70,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Page Header (Desktop) - Hidden on Mobile/Tablet */}
        <motion.div variants={itemVariants} className="mb-8 relative z-10 hidden lg:block">
          <h1 className="font-h1 !text-3xl text-primary mb-1">Sanctuary Home</h1>
          <p className="font-body-md text-outline">Welcome back. Continue tending to your daily study grove.</p>
        </motion.div>

        {/* Two-column layout grid for desktop, single column stack for mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-lg mb-6 md:mb-xl relative z-10 items-start">
          
          {/* LEFT COLUMN: Main Learning Actions (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-lg">
            {/* Page Header (Mobile/Tablet) - Hidden on Desktop */}
            <motion.div variants={itemVariants} className="relative z-10 lg:hidden mb-4 px-1">
              <h1 className="font-h1 !text-2xl text-primary mb-0.5">Sanctuary Home</h1>
              <p className="font-body-md text-outline">Welcome back. Continue tending to your daily study grove.</p>
            </motion.div>

            {/* Streak Card (Mobile/Tablet) - Hidden on Desktop */}
            <motion.section variants={itemVariants} className="relative z-10 lg:hidden">
              {renderStreakCard(false)}
            </motion.section>

            <motion.div 
              variants={itemVariants} 
              className="card-premium flex flex-col justify-between min-h-[160px] md:min-h-[200px] group"
            >
              <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />

              {/* Decorative Watermark "習" */}
              <div
                className="absolute right-2 bottom-0 opacity-[0.04] pointer-events-none select-none text-primary"
                style={{
                  fontFamily: "'Zen Kaku Gothic New', sans-serif",
                  fontSize: '90px',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
                aria-hidden="true"
              >
                習
              </div>

              <div className="relative z-10 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="block w-4 h-px bg-primary/45 shrink-0" />
                    <span
                      className="text-primary/75 tracking-[0.2em] uppercase text-[9px]"
                    >
                      {deckTitle} Reviews
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 border rounded-full font-sans italic font-medium ${dueCount > 0 ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-surface-variant/30 border-outline/10 text-outline'}`}
                  >
                    {dueCount > 0 ? `${dueCount} due` : 'all clear'}
                  </span>
                </div>
                
                <h2
                  className="font-h2 !text-xl text-on-surface mb-1"
                >
                  Recall & Spaced Repetition
                </h2>
                <p className="font-body-lg text-on-surface-variant/80 text-[11px] leading-relaxed max-w-md">
                  {dueCount > 0 
                    ? `You have ${dueCount} cards waiting for recall. Solidify your Japanese retention.`
                    : "The review garden is clear! No reviews due at this moment."
                  }
                </p>
              </div>

              <div className="relative z-10 flex gap-3">
                {dueCount > 0 ? (
                  <Button3D variant="primary" onClick={() => navigate('/flashcard?deckId=1')}>
                    Start Reviews
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>play_arrow</span>
                  </Button3D>
                ) : (
                  <Button3D variant="secondary" onClick={() => navigate('/flashcard?deckId=1')}>
                    Review Anyway
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>refresh</span>
                  </Button3D>
                )}
                <button 
                  onClick={() => navigate('/review')}
                  className="px-4 py-3 text-[10px] font-label-caps text-outline hover:text-primary tracking-widest transition-colors font-semibold flex items-center gap-1"
                >
                  ALL DECKS <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </button>
              </div>
            </motion.div>

            {/* Resume Lesson Card */}
            {(() => {
              const currentIncomplete = LESSONS.find(l => !completedLessons.includes(l.id));
              
              if (currentIncomplete) {
                return (
                  <motion.div 
                    variants={itemVariants} 
                    className="card-premium flex flex-col justify-between min-h-[160px] md:min-h-[200px] group"
                  >
                    <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
                    
                    <div className="relative z-10 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="block w-4 h-px bg-primary/45 shrink-0" />
                          <span
                            className="text-primary/75 tracking-[0.2em] uppercase text-[9px]"
                          >
                            Active Module
                          </span>
                        </div>
                        <span
                          className="text-xs px-2.5 py-0.5 border border-secondary/20 rounded-full bg-secondary/5 text-secondary font-sans italic font-medium"
                        >
                          {currentIncomplete.unit}
                        </span>
                      </div>

                      <h2
                        className="font-h2 !text-xl text-on-surface mb-0.5"
                      >
                        {currentIncomplete.title}
                      </h2>
                      <p
                        className="text-[10px] text-primary/70 font-semibold mb-2"
                      >
                        {currentIncomplete.phrase} ({currentIncomplete.meaning})
                      </p>
                      <p className="font-body-lg text-on-surface-variant/80 text-[11px] leading-relaxed max-w-md">
                        {currentIncomplete.description}
                      </p>
                    </div>
                    
                    <div className="relative z-10">
                      <Button3D variant="primary" onClick={() => navigate('/lessons')}>
                        Study Lesson
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>arrow_right_alt</span>
                      </Button3D>
                    </div>
                  </motion.div>
                );
              } else {
                return (
                  <motion.div 
                    variants={itemVariants} 
                    className="card-premium flex flex-col justify-between min-h-[160px] md:min-h-[200px] group"
                  >
                    <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
                    
                    <div className="relative z-10 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="block w-4 h-px bg-primary/45 shrink-0" />
                          <span
                            className="text-primary/75 tracking-[0.2em] uppercase text-[9px]"
                          >
                            Active Module
                          </span>
                        </div>
                        <span
                          className="text-xs px-2.5 py-0.5 border border-primary/20 rounded-full bg-primary/5 text-primary font-sans italic font-medium"
                        >
                          COMPLETED
                        </span>
                      </div>
                      <h2
                        className="font-h2 !text-xl text-on-surface mb-2"
                      >
                        All Foundations Mastered!
                      </h2>
                      <p className="font-body-lg text-on-surface-variant/80 text-[11px] leading-relaxed max-w-md">
                        You have completed all standard daily foundations lessons. Your path to mastery continues!
                      </p>
                    </div>
                    
                    <div className="relative z-10">
                      <Button3D variant="primary" onClick={() => navigate('/lessons')}>
                        Review Lessons
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>arrow_right_alt</span>
                      </Button3D>
                    </div>
                  </motion.div>
                );
              }
            })()}

            {/* Milestones Section */}
            <motion.section variants={itemVariants} className="relative z-10">
              <div className="flex justify-between items-baseline mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className="block w-4 h-px bg-primary/45 shrink-0" />
                  <span
                    className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-bold"
                  >
                    Journey Milestones
                  </span>
                </div>
                <button 
                  onClick={() => navigate('/progress')}
                  className="font-label-caps text-outline hover:text-primary transition-colors tracking-widest text-[9px] flex items-center gap-1 font-bold"
                >
                  VIEW ALL <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </button>
              </div>
              
              <div className="flex gap-3 overflow-x-auto pb-3 snap-x hide-scrollbar px-1">
                {milestones.map((m, idx) => {
                  const isUnlocked = m.check();
                  return (
                    <motion.div 
                      key={idx}
                      whileHover={isUnlocked ? { y: -3 } : {}}
                      className={`min-w-[110px] rounded-xl p-3 flex flex-col items-center border snap-center transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-surface border-outline/20 shadow-sm cursor-pointer' 
                          : 'bg-surface-bright border-outline/10 opacity-55 mix-blend-luminosity'
                      }`}
                    >
                      <div className="absolute inset-0 bg-washi opacity-15 pointer-events-none rounded-xl" />
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative border ${
                        isUnlocked 
                          ? 'bg-primary-container/20 border-primary/25 text-primary' 
                          : 'bg-surface border-outline/15 text-outline'
                      }`}>
                        <span 
                          className="material-symbols-outlined text-[20px] relative z-10" 
                          style={{ fontVariationSettings: `'FILL' ${isUnlocked ? 1 : 0}, 'wght' 200` }}
                        >
                          {m.icon}
                        </span>
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/40 rounded-full">
                            <span className="material-symbols-outlined text-[10px] text-outline opacity-60" style={{ fontVariationSettings: "'wght' 300" }}>lock</span>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-center tracking-wider text-[8px] font-bold ${isUnlocked ? 'text-on-surface' : 'text-outline/80'}`}
                      >
                        {m.name}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* RIGHT COLUMN: Stats Stack (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:gap-lg w-full">
            {/* Streak Card (Desktop Only) - Hidden on Mobile/Tablet */}
            <motion.section variants={itemVariants} className="relative z-10 hidden lg:block">
              {renderStreakCard(true)}
            </motion.section>

            {/* Mastery Card */}
            <motion.div variants={itemVariants} className="card-premium flex justify-center items-center">
              <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
              <MasteryRing progress={masteredWords} total={1000} label="Words Rooted" />
            </motion.div>

            {/* Daily Goal Card */}
            <motion.div variants={itemVariants} className="card-premium">
               <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
               <div className="flex justify-between items-end mb-3 md:mb-md relative z-10">
                  <div>
                    <h3 className="font-label-caps text-outline/70 tracking-widest text-[9px] mb-1">DAILY INTENT</h3>
                    <p className="font-h2 text-lg text-on-surface">Review {dailyGoal.total} Cards</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>check</span>
                  </div>
               </div>
               
               <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dailyGoal.current / dailyGoal.total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="h-full bg-secondary rounded-full"
                  />
               </div>
               <p className="text-outline text-right mt-2 relative z-10 tracking-widest font-mono text-[10px]">{dailyGoal.current} / {dailyGoal.total}</p>
            </motion.div>

            {/* Premium Promo Card */}
            {!user?.is_premium && (
              <motion.div 
                variants={itemVariants} 
                className="bg-surface rounded-xl p-5 border border-primary/20 relative overflow-hidden group shadow-sm text-left"
              >
                <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
                <div className="absolute inset-0 bg-primary/[0.01] group-hover:bg-primary/[0.03] transition-colors pointer-events-none" />
                <div className="absolute -right-6 -bottom-6 opacity-[0.05] pointer-events-none text-primary">
                  <span className="material-symbols-outlined text-[90px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-caps text-primary tracking-widest text-[9px] font-bold">MAINICHI PREMIUM</span>
                    </div>
                    <h3 className="font-h2 text-lg text-on-surface tracking-tight">Unlock Premium Realms</h3>
                    <p className="font-body-md text-on-surface-variant/80 text-[11px] leading-relaxed">
                      Get full access to premium community decks, unlimited custom study paths, and advanced stats for only <strong>RM10/mo</strong>!
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="w-full py-3 bg-primary hover:bg-primary/95 text-on-primary font-label-caps tracking-widest text-[9px] font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]"
                  >
                    Upgrade Now • RM10
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </PullToRefresh>
  );
};

export default Dashboard;
