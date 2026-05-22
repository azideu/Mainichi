import React from 'react';
import { motion } from 'framer-motion';
import Button3D from '../components/Button3D';

const Lessons = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto pb-xl"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 text-center md:text-left">
        <h1 className="font-h1 text-primary mb-2 tracking-tighter">Lessons</h1>
        <p className="font-body-lg text-outline">Unlock the structure of Japanese, step by step.</p>
      </motion.div>

      {/* Hero Card (Featured Lesson) */}
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg mb-12 shadow-paper-layer relative overflow-hidden flex flex-col md:flex-row gap-8 items-center border border-outline/10 group">
        {/* Washi texture overlay */}
        <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none"></div>
        {/* Matcha ink wash effect */}
        <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-1000 ease-out"></div>
        
        <div className="w-full md:w-5/12 aspect-[4/3] rounded-xl overflow-hidden shrink-0 relative z-10 border border-outline/20 shadow-ambient group-hover:scale-[1.02] transition-transform duration-700">
          <img alt="Japanese grammar illustration" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugkcQDIO2J4w2SE9TtgyiKaxoeuIILrIj2Q0SbLb8E2Mg9V0h4s5JQ340VnUE-43L5Ib8D9OKvGGQ70uhvweY3_xD5Xax3IzEjGXjnsxeZaPhN0MV4RqC7ttgFJ3e6DmydaWVnkXbYhLlD5a3SuGr3jb03CkNhb-t0LRQkAnzir535rL_rGuQRbUpkBzpwIC9dXiyJ4CFN0mMRiJLrAV-wL5Q-L-NeL5Re2AMnjSzB-4vL-HvdhWMPKH3tBHDBshQgX7PN14XHS"/>
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="inline-block bg-tertiary/10 text-tertiary border border-tertiary/20 font-label-caps tracking-widest px-3 py-1 rounded-full mb-3">CURRENT FOCUS</span>
              <h3 className="font-h2 text-on-surface tracking-tight">Verbs: Te-Form</h3>
            </div>
            <div className="w-14 h-14 rounded-3xl bg-surface-bright border border-outline/20 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>extension</span>
            </div>
          </div>
          
          <p className="font-body-md text-on-surface-variant mb-8 leading-relaxed">Master the essential connector form for complex sentences, sequencing actions, and making polite requests.</p>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between font-label-caps text-outline tracking-widest mb-2">
              <span>PROGRESS</span>
              <span>0%</span>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[0%]"></div>
            </div>
          </div>
          
          <div className="self-start w-full md:w-auto">
            <Button3D variant="primary">
              Commence Training
            </Button3D>
          </div>
        </div>
      </motion.div>

      {/* Section Title */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6 mt-12">
        <h3 className="font-h2 text-on-surface tracking-tight">Foundations</h3>
        <div className="h-[1px] flex-1 bg-outline/20"></div>
      </motion.div>
      
      {/* Asymmetrical Layout for Modules */}
      <div className="flex flex-col gap-6">
        
        {/* Module 1: Particles (Full width row) */}
        <motion.div variants={itemVariants} className="bg-surface rounded-xl p-lg shadow-paper-layer border border-outline/10 flex flex-col md:flex-row hover:border-secondary/30 hover:bg-secondary-container/20 transition-all cursor-pointer group relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
             <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>join_inner</span>
          </div>
          
          <div className="md:w-1/3 pr-6 mb-4 md:mb-0">
             <div className="flex justify-between items-center mb-4">
                <div className="w-14 h-14 rounded-2xl bg-surface-bright border border-outline/20 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>join_inner</span>
                </div>
                <span className="font-label-caps tracking-widest text-secondary border border-secondary/20 bg-secondary/5 px-3 py-1 rounded-full">NOT STARTED</span>
             </div>
             <h4 className="font-h3 text-on-surface">Particles (助詞)</h4>
          </div>
          <div className="md:w-2/3 md:pl-6 md:border-l border-outline/10 flex flex-col justify-center">
             <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">The invisible glue of Japanese sentences. Learn how to connect subjects, objects, and destinations with wa, ga, o, ni, and de.</p>
             <div className="flex items-center gap-4 mt-auto">
                <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full w-[0%]"></div>
                </div>
                <span className="font-label-caps tracking-widest text-secondary text-xs">0%</span>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 2: Noun Sentences */}
          <motion.div variants={itemVariants} className="bg-surface-bright rounded-3xl p-lg border border-outline/10 flex flex-col hover:bg-surface transition-colors cursor-pointer group relative opacity-70 hover:opacity-100">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface border border-outline/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-outline text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>category</span>
              </div>
              <span className="font-label-caps tracking-widest text-outline border border-outline/20 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span> LOCKED
              </span>
            </div>
            <h4 className="font-h3 text-on-surface mb-3">Noun Sentences</h4>
            <p className="font-body-md text-outline mb-6 flex-grow leading-relaxed">Mastering the art of stating facts. Saying "A is B" using desu and da.</p>
            
            <div className="flex items-center gap-4 opacity-50 mt-auto">
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden"></div>
              <span className="font-label-caps tracking-widest text-outline text-xs">0%</span>
            </div>
          </motion.div>

          {/* Module 3: Adjectives */}
          <motion.div variants={itemVariants} className="bg-surface-bright rounded-2xl p-lg border border-outline/10 flex flex-col hover:bg-surface transition-colors cursor-pointer group relative opacity-70 hover:opacity-100">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-surface border border-outline/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-outline text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>brush</span>
              </div>
              <span className="font-label-caps tracking-widest text-outline border border-outline/20 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">lock</span> LOCKED
              </span>
            </div>
            <h4 className="font-h3 text-on-surface mb-3">Adjectives</h4>
            <p className="font-body-md text-outline mb-6 flex-grow leading-relaxed">Adding color to the world. Describing things with i-adjectives and na-adjectives.</p>
            
            <div className="flex items-center gap-4 opacity-50 mt-auto">
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden"></div>
              <span className="font-label-caps tracking-widest text-outline text-xs">0%</span>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default Lessons;
