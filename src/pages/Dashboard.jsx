import React, { useState } from 'react';
import MasteryRing from '../components/MasteryRing';
import Button3D from '../components/Button3D';
import PullToRefresh from '../components/PullToRefresh';
import { useApp } from '../context/AppContext';

const Dashboard = () => {
  const { streak, masteredWords, dailyGoal } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="animate-in fade-in duration-300">
        {/* Hero Section / Daily Streak */}
        <section className="bg-gradient-to-br from-primary-container to-primary rounded-xl p-md mb-md shadow-[0_4px_16px_rgba(155,69,0,0.15)] flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="z-10">
            <p className="font-label-caps text-primary-fixed mb-xs">DAILY STREAK</p>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[40px] text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <span className="font-h1 text-primary-fixed">{streak}</span>
            </div>
            <p className="font-body-md text-primary-fixed/90 mt-xs">{streak > 0 ? "Keep it up! You're on fire." : "Start your learning journey today!"}</p>
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mb-md">
          
          {/* Resume Lesson Card */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-variant flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-sm">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
                </div>
                <span className="font-label-caps text-tertiary px-2 py-1 bg-tertiary-container/30 rounded-full">UNIT 3</span>
              </div>
              <h2 className="font-h3 text-on-surface mb-xs">Food & Dining</h2>
              <p className="font-body-md text-on-surface-variant mb-md">Master ordering sushi and expressing your preferences.</p>
            </div>
            <Button3D variant="primary">
              Start Lesson
              <span className="material-symbols-outlined">arrow_forward</span>
            </Button3D>
          </div>

          <MasteryRing progress={masteredWords} total={1000} label="Words learned" />

          {/* Daily Goal Card */}
          <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-surface-variant">
            <h3 className="font-h3 text-on-surface mb-sm">Daily Goal</h3>
            <div className="flex items-center gap-sm mb-xs">
              <span className="material-symbols-outlined text-tertiary">check_circle</span>
              <p className="font-body-lg text-on-surface">Review {dailyGoal.total} Flashcards</p>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-3 mb-2">
              <div 
                className="bg-tertiary h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${(dailyGoal.current / dailyGoal.total) * 100}%` }}
              ></div>
            </div>
            <p className="font-body-md text-on-surface-variant text-right">{dailyGoal.current} / {dailyGoal.total}</p>
          </div>
        </div>

        {/* Achievement Badges Section */}
        <section className="mb-md">
          <h2 className="font-h2 text-on-surface mb-sm">Achievements</h2>
          <div className="flex gap-sm overflow-x-auto pb-4 snap-x hide-scrollbar">
            {/* Unlocked Badge */}
            <div className="min-w-[120px] bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center border border-surface-variant shadow-[0_4px_12px_rgba(155,69,0,0.25)] snap-center">
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center mb-xs relative shadow-[0_0_15px_rgba(155,69,0,0.6)]">
                <span className="material-symbols-outlined text-[32px] text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="font-label-caps text-on-surface text-center">First Week</p>
            </div>
            
            {/* Locked Badge */}
            <div className="min-w-[120px] bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center border border-surface-variant opacity-60 snap-center">
              <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-xs">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <p className="font-label-caps text-on-surface-variant text-center">Polyglot</p>
            </div>

            {/* Locked Badge */}
            <div className="min-w-[120px] bg-surface-container-lowest rounded-xl p-sm flex flex-col items-center border border-surface-variant opacity-60 snap-center">
              <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center mb-xs">
                <span className="material-symbols-outlined text-[32px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              </div>
              <p className="font-label-caps text-on-surface-variant text-center">Scholar</p>
            </div>
          </div>
        </section>
      </div>
    </PullToRefresh>
  );
};

export default Dashboard;
