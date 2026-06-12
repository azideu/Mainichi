import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MasteryRing from '../components/MasteryRing';
import Button3D from '../components/Button3D';
import PullToRefresh from '../components/PullToRefresh';
import LoadingState from '../components/LoadingState';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

import logoNoText from '../assets/logo-no-text.svg';

const Dashboard = () => {
  const { streak, masteredWords, dailyGoal, fetchStats, isFetchingStats } = useApp();
  const { user, setIsPremiumModalOpen } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
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
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (isFetchingStats && !isRefreshing) {
    return <LoadingState />;
  }

  const renderStreakCard = (isCompact = false) => {
    return (
      <div className={`bg-surface-bright rounded-2xl shadow-ambient border border-outline/10 relative overflow-hidden group ${isCompact ? 'p-lg' : 'p-xl'}`}>
        {/* Ink wash background effect */}
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000 ease-out"></div>
        
        {/* Decorative Japanese element as absolute watermark */}
        <div className="absolute -right-6 -bottom-8 opacity-[0.08] pointer-events-none select-none text-primary transition-transform duration-700 group-hover:scale-110">
          <span className="text-[140px] leading-none font-bold" style={{ fontFamily: "serif" }}>道</span>
        </div>

        <div className="relative z-10 text-left">
          <motion.p 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="font-label-caps text-outline mb-4 tracking-widest text-[9px]"
          >
            DAILY STREAK
          </motion.p>
          <div className="flex items-center gap-md">
            <div className={`rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-paper-layer shrink-0 ${isCompact ? 'w-12 h-12' : 'w-16 h-16'}`}>
              <span className={`material-symbols-outlined text-primary ${isCompact ? 'text-[28px]' : 'text-[36px]'}`} style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>local_fire_department</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-h1 text-primary leading-none tracking-tighter ${isCompact ? 'text-[48px]' : 'text-[64px]'}`}>{streak}</span>
              <span className="font-h3 text-primary/60 text-[14px]">{streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <p className="font-body-md text-on-surface-variant mt-sm max-w-sm leading-relaxed">
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
        className="max-w-6xl mx-auto pb-xl relative px-2 sm:px-4"
      >
        {/* Ambient background blur */}
        <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>

        {/* Page Header (Desktop) - Hidden on Mobile/Tablet */}
        <motion.div variants={itemVariants} className="mb-8 relative z-10 hidden lg:block">
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Home</h1>
          <p className="font-body-md text-outline">Welcome back! Continue tending to your daily study garden.</p>
        </motion.div>

        {/* Two-column layout grid for desktop, single column stack for mobile/tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-xl relative z-10 items-start">
          
          {/* LEFT COLUMN: Main Learning Actions (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-lg">
            {/* Page Header (Mobile/Tablet) - Hidden on Desktop */}
            <motion.div variants={itemVariants} className="relative z-10 lg:hidden mb-4">
              <h1 className="font-h1 text-primary mb-2 tracking-tighter">Home</h1>
              <p className="font-body-md text-outline">Welcome back! Continue tending to your daily study garden.</p>
            </motion.div>

            {/* Streak Card (Mobile/Tablet) - Hidden on Desktop */}
            <motion.section variants={itemVariants} className="relative z-10 lg:hidden">
              {renderStreakCard(false)}
            </motion.section>

            {/* Resume Lesson Card */}
            <motion.div variants={itemVariants} className="bg-surface rounded-xl p-lg shadow-paper-layer border border-outline/20 flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors duration-500 min-h-[220px]">
              <div className="absolute -right-12 -top-12 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                 <img src={logoNoText} alt="" className="w-[200px] h-auto" />
              </div>
              
              <div className="relative z-10 mb-xl">
                <div className="flex justify-between items-start mb-md">
                  <div className="w-14 h-14 rounded-2xl border border-outline/20 flex items-center justify-center bg-surface-bright shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-[28px]" style={{ fontVariationSettings: "'wght' 200" }}>menu_book</span>
                  </div>
                  <span className="font-label-caps tracking-widest text-secondary px-4 py-2 border border-secondary/20 rounded-full bg-secondary/5">UNIT 3</span>
                </div>
                <h2 className="font-h2 text-on-surface mb-xs tracking-tight">Food & Dining</h2>
                <p className="font-body-lg text-on-surface-variant max-w-md">Master the art of ordering sushi and expressing your subtle preferences.</p>
              </div>
              
              <div className="relative z-10">
                <Button3D variant="primary" onClick={() => navigate('/lessons')}>
                  Resume Path
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>arrow_right_alt</span>
                </Button3D>
              </div>
            </motion.div>

            {/* Milestones Section */}
            <motion.section variants={itemVariants} className="relative z-10">
              <div className="flex justify-between items-baseline mb-lg">
                <h2 className="font-h2 text-on-surface tracking-tight">Journey Milestones</h2>
                <button 
                  onClick={() => navigate('/progress')}
                  className="font-label-caps text-outline hover:text-primary transition-colors tracking-widest flex items-center gap-1"
                >
                  VIEW ALL <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
              
              <div className="flex gap-md overflow-x-auto pb-6 snap-x hide-scrollbar px-2 -mx-2">
                {milestones.map((m, idx) => {
                  const isUnlocked = m.check();
                  return (
                    <motion.div 
                      key={idx}
                      whileHover={isUnlocked ? { y: -5 } : {}}
                      className={`min-w-[140px] rounded-xl p-md flex flex-col items-center border snap-center transition-all duration-300 ${
                        isUnlocked 
                          ? 'bg-surface border-outline/20 shadow-paper-layer cursor-pointer group' 
                          : 'bg-surface-bright border-outline/10 opacity-50 mix-blend-luminosity'
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-md relative border ${
                        isUnlocked 
                          ? 'bg-primary-container/20 border-primary/30 text-primary shadow-sm' 
                          : 'bg-surface border-outline/20 text-outline'
                      }`}>
                        {isUnlocked && <div className="absolute inset-0 bg-primary/5 rounded-inherit"></div>}
                        <span 
                          className="material-symbols-outlined text-[32px] relative z-10" 
                          style={{ fontVariationSettings: `'FILL' ${isUnlocked ? 1 : 0}, 'wght' 200` }}
                        >
                          {m.icon}
                        </span>
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/40 rounded-full">
                            <span className="material-symbols-outlined text-[14px] text-outline opacity-65" style={{ fontVariationSettings: "'wght' 300" }}>lock</span>
                          </div>
                        )}
                      </div>
                      <p className={`font-label-caps text-center tracking-widest text-[9px] font-bold ${isUnlocked ? 'text-on-surface' : 'text-outline'}`}>
                        {m.name}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          {/* RIGHT COLUMN: Stats Stack (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-lg w-full">
            {/* Streak Card (Desktop Only) - Hidden on Mobile/Tablet */}
            <motion.section variants={itemVariants} className="relative z-10 hidden lg:block">
              {renderStreakCard(true)}
            </motion.section>

            {/* Mastery Card */}
            <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-lg shadow-paper-layer border border-outline/20 flex justify-center items-center">
              <MasteryRing progress={masteredWords} total={1000} label="Words Rooted" />
            </motion.div>

            {/* Daily Goal Card */}
            <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/20 relative overflow-hidden">
               <div className="flex justify-between items-end mb-md relative z-10">
                  <div>
                    <h3 className="font-label-caps text-outline tracking-widest mb-2">DAILY INTENT</h3>
                    <p className="font-h3 text-on-surface">Review {dailyGoal.total} Cards</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>check</span>
                  </div>
               </div>
               
               <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dailyGoal.current / dailyGoal.total) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="h-full bg-secondary rounded-full"
                  />
               </div>
               <p className="font-body-md text-outline text-right mt-3 relative z-10 tracking-widest font-mono text-sm">{dailyGoal.current} / {dailyGoal.total}</p>
            </motion.div>

            {/* Premium Promo Card */}
            {!user?.is_premium && (
              <motion.div 
                variants={itemVariants} 
                className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-300 text-left"
              >
                <div className="absolute inset-0 bg-primary/[0.02] group-hover:bg-primary/[0.04] transition-colors pointer-events-none" />
                <div className="absolute -right-6 -bottom-6 opacity-[0.06] pointer-events-none text-primary">
                  <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-label-caps text-primary tracking-widest text-[10px] font-bold">MAINICHI PREMIUM</span>
                    </div>
                    <h3 className="font-h3 text-on-surface tracking-tight">Unlock Premium Realms</h3>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">
                      Get full access to premium community decks, unlimited custom study paths, and advanced stats for only <strong>RM10/mo</strong>!
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsPremiumModalOpen(true)}
                    className="w-full py-3.5 bg-primary hover:bg-primary/95 text-on-primary font-label-caps tracking-widest text-[10px] font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]"
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
