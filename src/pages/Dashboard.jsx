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

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto pb-xl relative"
      >
        {/* Ambient background blur */}
        <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-container/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply"></div>

        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8 text-center md:text-left relative z-10">
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Home</h1>
          <p className="font-body-md text-outline">Welcome back! Continue tending to your daily study garden.</p>
        </motion.div>

        {/* Hero Section / Daily Streak - Layered Canopy */}
        <motion.section variants={itemVariants} className="relative z-10 mb-xl mt-md">
          <div className="bg-surface-bright rounded-2xl p-xl shadow-ambient border border-outline/10 relative overflow-hidden group">
            {/* Ink wash background effect */}
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000 ease-out"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
              <div>
                <motion.p 
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="font-label-caps text-outline mb-4 tracking-widest"
                >
                  DAILY STREAK
                </motion.p>
                <div className="flex items-center gap-md">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-paper-layer">
                    <span className="material-symbols-outlined text-[36px] text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>local_fire_department</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-h1 text-[64px] text-primary leading-none tracking-tighter">{streak}</span>
                    <span className="font-h3 text-primary/60">{streak === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>
                <p className="font-body-lg text-on-surface-variant mt-sm max-w-sm">
                  {streak > 0 ? "The forest grows stronger with your consistency. Keep tending to your journey." : "Plant the first seed of your learning journey today."}
                </p>
              </div>

              {/* Decorative Japanese element */}
              <div className="hidden md:flex flex-col items-end opacity-20 pointer-events-none">
                <span className="font-h1 text-[120px] leading-none text-primary" style={{ fontFamily: "serif" }}>道</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main Dashboard Grid - Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg mb-xl relative z-10">
          
          {/* Resume Lesson Card - Takes up 7 columns on large screens */}
          <motion.div variants={itemVariants} className="lg:col-span-7 bg-surface rounded-xl p-lg shadow-paper-layer border border-outline/20 flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
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

          {/* Right Column Stack (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-lg">
            
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

        {/* Milestones Section */}
        <motion.section variants={itemVariants} className="relative z-10 mb-xl">
          <div className="flex justify-between items-baseline mb-lg">
            <h2 className="font-h2 text-on-surface tracking-tight">Milestones</h2>
            <button 
              onClick={() => navigate('/progress')}
              className="font-label-caps text-outline hover:text-primary transition-colors tracking-widest flex items-center gap-1"
            >
              VIEW ALL <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          
          <div className="flex gap-md overflow-x-auto pb-6 snap-x hide-scrollbar px-2 -mx-2">
            {/* Unlocked Badge */}
            <motion.div whileHover={{ y: -5 }} className="min-w-[140px] bg-surface rounded-xl p-md flex flex-col items-center border border-outline/20 shadow-paper-layer snap-center cursor-pointer group">
              <div className="w-20 h-20 rounded-2xl border border-primary/20 bg-surface-bright flex items-center justify-center mb-md relative shadow-ambient transition-transform duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-primary/5 rounded-inherit"></div>
                <span className="material-symbols-outlined text-[36px] text-primary relative z-10" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>star</span>
              </div>
              <p className="font-label-caps text-on-surface text-center tracking-widest">FIRST WEEK</p>
            </motion.div>
            
            {/* Locked Badge */}
            <div className="min-w-[140px] bg-surface-bright rounded-2xl p-md flex flex-col items-center border border-outline/10 opacity-50 snap-center mix-blend-luminosity">
              <div className="w-20 h-20 rounded-3xl border border-outline/20 bg-surface flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[36px] text-outline" style={{ fontVariationSettings: "'wght' 200" }}>emoji_events</span>
              </div>
              <p className="font-label-caps text-outline text-center tracking-widest">POLYGLOT</p>
            </div>

            {/* Locked Badge */}
            <div className="min-w-[140px] bg-surface-bright rounded-xl p-md flex flex-col items-center border border-outline/10 opacity-50 snap-center mix-blend-luminosity">
              <div className="w-20 h-20 rounded-xl border border-outline/20 bg-surface flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[36px] text-outline" style={{ fontVariationSettings: "'wght' 200" }}>school</span>
              </div>
              <p className="font-label-caps text-outline text-center tracking-widest">SCHOLAR</p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PullToRefresh>
  );
};

export default Dashboard;
