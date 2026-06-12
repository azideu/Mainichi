import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';

const Settings = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  const { masteryRequirement, dailyGoal, updateSettings, fetchStats } = useApp();
  const [localMastery, setLocalMastery] = useState(masteryRequirement);
  const [localGoal, setLocalGoal] = useState(dailyGoal.total);
  const [dailyReminders, setDailyReminders] = useState(localStorage.getItem('mainichi_daily_reminders') !== 'false');
  const [communityUpdates, setCommunityUpdates] = useState(localStorage.getItem('mainichi_community_updates') === 'true');
  const [isSaving, setIsSaving] = useState(false);
  const [isDemoActionLoading, setIsDemoActionLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  useEffect(() => {
    setLocalMastery(masteryRequirement);
    setLocalGoal(dailyGoal.total);
  }, [masteryRequirement, dailyGoal.total]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await updateSettings(localMastery, localGoal);
    localStorage.setItem('mainichi_daily_reminders', dailyReminders.toString());
    localStorage.setItem('mainichi_community_updates', communityUpdates.toString());
    setIsSaving(false);
  };

  const handleResetProgress = async () => {
    setIsDemoActionLoading(true);
    setDemoMessage('');
    try {
      const token = localStorage.getItem('mainichi_token');
      const tzOffset = new Date().getTimezoneOffset().toString();
      const res = await fetch(`/api/progress/demo/reset?tzOffset=${tzOffset}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Timezone-Offset': tzOffset
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDemoMessage(data.message);
        await fetchStats();
      } else {
        setDemoMessage('Error resetting progress.');
      }
    } catch (err) {
      console.error(err);
      setDemoMessage('Network error.');
    } finally {
      setIsDemoActionLoading(false);
    }
  };

  const handleSimulateStreak = async () => {
    setIsDemoActionLoading(true);
    setDemoMessage('');
    try {
      const token = localStorage.getItem('mainichi_token');
      const tzOffset = new Date().getTimezoneOffset().toString();
      const res = await fetch(`/api/progress/demo/simulate-streak?tzOffset=${tzOffset}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Timezone-Offset': tzOffset
        }
      });
      if (res.ok) {
        const data = await res.json();
        setDemoMessage(data.message);
        await fetchStats();
      } else {
        setDemoMessage('Error simulating streak.');
      }
    } catch (err) {
      console.error(err);
      setDemoMessage('Network error.');
    } finally {
      setIsDemoActionLoading(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto pb-xl px-2 sm:px-4">
      <div className="hidden md:flex items-center gap-4 mb-8 relative z-10">
        <motion.button 
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="md:hidden w-11 h-11 flex items-center justify-center bg-surface hover:bg-surface-variant text-outline hover:text-primary rounded-xl border border-outline/10 shadow-sm active:scale-95 transition-all duration-200"
          title="Back"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>arrow_back</span>
        </motion.button>
        <motion.h1 variants={itemVariants} className="font-h1 text-primary tracking-tighter mb-2">Settings</motion.h1>
      </div>
      
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-6 tracking-tight relative z-10">Notifications</h3>
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface tracking-wide">Daily Reminders</p>
              <p className="font-label-caps text-outline tracking-widest mt-1">MAINTAIN YOUR STREAK</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={dailyReminders} 
                onChange={(e) => setDailyReminders(e.target.checked)} 
              />
              <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline/10 group-hover:shadow-sm transition-colors duration-300"></div>
            </label>
          </div>
          
          <div className="h-[1px] bg-outline/10 w-full" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface tracking-wide">Community Updates</p>
              <p className="font-label-caps text-outline tracking-widest mt-1">NOTES FROM FELLOW WANDERERS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={communityUpdates} 
                onChange={(e) => setCommunityUpdates(e.target.checked)} 
              />
              <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline/10 group-hover:shadow-sm transition-colors duration-300"></div>
            </label>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-6 tracking-tight relative z-10">Learning Preferences</h3>
        
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col">
            <label className="font-body-md text-on-surface tracking-wide mb-1">Mastery Requirement</label>
            <p className="font-label-caps text-outline tracking-widest mb-3">CONSECUTIVE SUCCESSFUL REVIEWS (MAX 10)</p>
            <input 
              type="number" 
              min="1" 
              max="10" 
              value={localMastery} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setLocalMastery("");
                  return;
                }
                const num = parseInt(val);
                if (!isNaN(num)) {
                  setLocalMastery(Math.min(10, num));
                }
              }}
              onBlur={() => {
                if (localMastery === "" || localMastery < 1) setLocalMastery(1);
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="font-body-md text-on-surface tracking-wide mb-1">Daily Review Goal</label>
            <p className="font-label-caps text-outline tracking-widest mb-3">CARDS TO REVIEW EACH DAY</p>
            <input 
              type="number" 
              min="1" 
              value={localGoal} 
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setLocalGoal("");
                  return;
                }
                const num = parseInt(val);
                if (!isNaN(num)) {
                  setLocalGoal(num);
                }
              }}
              onBlur={() => {
                if (localGoal === "" || localGoal < 1) setLocalGoal(1);
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
            />
          </div>

          <div className="pt-4">
            <Button3D variant="primary" className="w-full" onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button3D>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-2 tracking-tight relative z-10 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>biotech</span>
          Presentation Sandbox
        </h3>
        <p className="font-label-caps text-outline tracking-widest mb-6 relative z-10">PREPARE DEMONSTRATIONS INSTANTLY</p>
        
        <div className="space-y-4 relative z-10">
          <p className="font-body-md text-on-surface-variant leading-relaxed">
            Ensure you have perfect material to showcase. Reload all 80 JLPT N5 cards into your due queue or simulate a live 5-day active study streak.
          </p>

          {demoMessage && (
            <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary font-body-sm text-center animate-in fade-in zoom-in-95">
              {demoMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Button3D 
              variant="secondary" 
              onClick={handleResetProgress} 
              disabled={isDemoActionLoading}
              className="w-full text-xs font-semibold py-3"
            >
              Reset Queue (Fresh Start)
            </Button3D>
            <Button3D 
              variant="primary" 
              onClick={handleSimulateStreak} 
              disabled={isDemoActionLoading}
              className="w-full text-xs font-semibold py-3"
            >
              Simulate 5-Day Active Streak
            </Button3D>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-error/5 rounded-xl p-lg border border-error/20 relative overflow-hidden">
        <h3 className="font-h3 text-error mb-3 tracking-tight relative z-10">Danger Zone</h3>
        <p className="font-body-md text-on-surface-variant mb-8 relative z-10 leading-relaxed">
          Once you delete your account, there is no going back. All your progress will be erased. Please be certain.
        </p>
        <button className="w-full px-6 py-3 border-2 border-error text-error font-label-caps tracking-widest rounded-xl hover:bg-error hover:text-white transition-all shadow-sm active:scale-95 relative z-10">
          DELETE ACCOUNT
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
