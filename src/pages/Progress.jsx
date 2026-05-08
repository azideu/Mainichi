import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import MasteryRing from '../components/MasteryRing';
import Button3D from '../components/Button3D';

const Progress = () => {
  const { user, logout } = useAuth();
  const { streak, masteredWords } = useApp();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-md mx-auto pb-xl">
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-12 mt-4">
        <div className="w-28 h-28 rounded-2xl overflow-hidden border border-outline/20 shadow-paper-layer mb-6 bg-surface-bright p-1">
          <div className="w-full h-full rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply z-10 pointer-events-none"></div>
            <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh4KuvQk9ObilNoyVYD3socfuAYe31_rOs23VAMSuZbDDLPtK_goQ20pk9Vv07d507e09Qi2VoDqfep8E1IcCO1ijTfAEil6bvkQwekWKWxymqw-BXY6ZHq2IZMnY9dJ9flJAo2zihS9MCpG2Ams5HiiS4WYClvx_AjOnmtYemg1YSZ7fwHDMXpGWUsjNMf_PLos0WlQ-qb2uglxuyonIHGQ_YCZnyPyg7X0cDR5ue5lrPsupyw7sxlSPlS6xBcPEb2hkn_UDX_as" />
          </div>
        </div>
        <h2 className="font-h2 text-on-surface tracking-tighter">{user?.name || 'Wanderer'}</h2>
        <p className="font-body-md text-outline tracking-wide">{user?.email || 'journey@mainichi.app'}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-surface rounded-xl p-md border border-outline/10 shadow-paper-layer flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <span className="material-symbols-outlined text-[32px] text-primary mb-3" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>local_fire_department</span>
          <h3 className="font-h1 text-primary tracking-tighter">{streak}</h3>
          <p className="font-label-caps text-outline text-center tracking-widest mt-1">DAY STREAK</p>
        </div>
        <div className="bg-surface rounded-2xl p-md border border-outline/10 shadow-paper-layer flex flex-col items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <span className="material-symbols-outlined text-[32px] text-tertiary mb-3" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>translate</span>
          <h3 className="font-h1 text-tertiary tracking-tighter">{masteredWords}</h3>
          <p className="font-label-caps text-outline text-center tracking-widest mt-1">MASTERED</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-12 bg-surface rounded-3xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-6 tracking-tight text-center relative z-10">Learning Analytics</h3>
        <div className="relative z-10">
          <MasteryRing progress={65} total={100} label="Grammar Accuracy %" />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="font-label-caps text-outline tracking-[0.2em] mb-4 pl-2">ACCOUNT</h3>
        <button className="w-full bg-surface p-5 rounded-xl border border-outline/10 shadow-paper-layer flex justify-between items-center hover:bg-surface-bright hover:border-primary/20 transition-all group">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{ fontVariationSettings: "'wght' 300" }}>settings</span>
            <span className="font-body-md text-on-surface tracking-wide">Settings</span>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>chevron_right</span>
        </button>
        <button onClick={() => {
          import('../utils/appInventorBridge').then(module => {
            module.sendToAppInventor(module.APP_INVENTOR_EVENTS.VIBRATE_PHONE);
          });
        }} className="w-full bg-primary/10 p-5 rounded-2xl border border-primary/20 flex justify-between items-center hover:bg-primary/20 transition-colors group mb-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'wght' 300" }}>vibration</span>
            <span className="font-body-md text-primary tracking-wide">Test Phone Vibration</span>
          </div>
        </button>
        <button onClick={logout} className="w-full bg-error/5 p-5 rounded-2xl border border-error/10 flex justify-between items-center hover:bg-error/10 transition-colors group">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'wght' 300" }}>logout</span>
            <span className="font-body-md text-error tracking-wide">Depart</span>
          </div>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Progress;
