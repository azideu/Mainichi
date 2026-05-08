import React from 'react';
import { motion } from 'framer-motion';
import Button3D from '../components/Button3D';

const Settings = () => {
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
      <motion.h2 variants={itemVariants} className="font-h1 text-primary mb-8 tracking-tighter">Settings</motion.h2>
      
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
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline/10 group-hover:shadow-sm"></div>
            </label>
          </div>
          
          <div className="h-[1px] bg-outline/10 w-full" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface tracking-wide">Community Updates</p>
              <p className="font-label-caps text-outline tracking-widest mt-1">NOTES FROM FELLOW WANDERERS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-12 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-outline/10 group-hover:shadow-sm"></div>
            </label>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-error/5 rounded-xl p-lg border border-error/20 relative overflow-hidden">
        <h3 className="font-h3 text-error mb-3 tracking-tight relative z-10">Danger Zone</h3>
        <p className="font-body-md text-on-surface-variant mb-6 relative z-10 leading-relaxed">
          Once you delete your account, there is no going back. All your progress will be erased. Please be certain.
        </p>
        <button className="px-6 py-3 border-2 border-error text-error font-label-caps tracking-widest rounded-xl hover:bg-error hover:text-white transition-all shadow-sm active:scale-95 relative z-10">
          DELETE ACCOUNT
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
