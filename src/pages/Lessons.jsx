import React from 'react';
import Button3D from '../components/Button3D';

const Lessons = () => {
  return (
    <div className="animate-in fade-in max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-h1 text-primary mb-2">Grammar Mastery</h2>
        <p className="font-body-md text-on-surface-variant">Unlock the structure of Japanese, step by step.</p>
      </div>

      {/* Hero Card (Featured Lesson) */}
      <div className="bg-surface-container-lowest rounded-xl p-md mb-8 shadow-[0_4px_12px_rgba(155,69,0,0.05)] relative overflow-hidden flex flex-col md:flex-row gap-6 items-center border border-surface-variant">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-fixed rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="w-full md:w-1/3 aspect-[1.54] rounded-lg overflow-hidden shrink-0">
          <img alt="Japanese grammar illustration" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/ADBb0ugkcQDIO2J4w2SE9TtgyiKaxoeuIILrIj2Q0SbLb8E2Mg9V0h4s5JQ340VnUE-43L5Ib8D9OKvGGQ70uhvweY3_xD5Xax3IzEjGXjnsxeZaPhN0MV4RqC7ttgFJ3e6DmydaWVnkXbYhLlD5a3SuGr3jb03CkNhb-t0LRQkAnzir535rL_rGuQRbUpkBzpwIC9dXiyJ4CFN0mMRiJLrAV-wL5Q-L-NeL5Re2AMnjSzB-4vL-HvdhWMPKH3tBHDBshQgX7PN14XHS"/>
        </div>
        
        <div className="flex-1 flex flex-col justify-center w-full z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="inline-block bg-tertiary-container text-on-tertiary-container font-label-caps px-2 py-1 rounded-sm mb-2">CONTINUE LEARNING</span>
              <h3 className="font-h2 text-on-background">Verbs: Te-Form</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>extension</span>
            </div>
          </div>
          
          <p className="font-body-md text-on-surface-variant mb-6">Master the essential connector form for complex sentences and requests.</p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between font-label-caps text-on-surface-variant mb-1">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[65%]"></div>
            </div>
          </div>
          
          <div className="self-start">
            <Button3D variant="primary">Resume Lesson</Button3D>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <h3 className="font-h2 text-on-background mb-4 mt-8">Foundations</h3>
      
      {/* Bento Grid Layout for Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Module 1: Particles */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(155,69,0,0.05)] border border-surface-variant flex flex-col hover:bg-surface-container-high transition-colors cursor-pointer group">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>join_inner</span>
            </div>
            <span className="font-label-caps text-secondary bg-secondary-container px-2 py-1 rounded-sm">COMPLETED</span>
          </div>
          <h4 className="font-h3 text-on-background mb-2">Particles (助詞)</h4>
          <p className="font-body-md text-on-surface-variant mb-6 flex-grow">The glue of Japanese sentences. Learn wa, ga, o, ni, and de.</p>
          
          <div className="flex items-center gap-3">
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full w-full"></div>
            </div>
            <span className="font-label-caps text-secondary">100%</span>
          </div>
        </div>

        {/* Module 2: Noun Sentences */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(155,69,0,0.05)] border border-surface-variant flex flex-col hover:bg-surface-container-high transition-colors cursor-pointer group">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>category</span>
            </div>
            <span className="font-label-caps text-primary bg-primary-fixed px-2 py-1 rounded-sm">IN PROGRESS</span>
          </div>
          <h4 className="font-h3 text-on-background mb-2">Noun Sentences</h4>
          <p className="font-body-md text-on-surface-variant mb-6 flex-grow">Saying "A is B" using desu and da.</p>
          
          <div className="flex items-center gap-3">
            <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[80%]"></div>
            </div>
            <span className="font-label-caps text-primary">80%</span>
          </div>
        </div>

        {/* Module 3: Adjectives */}
        <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0_4px_12px_rgba(155,69,0,0.05)] border border-surface-variant flex flex-col hover:bg-surface-container-high transition-colors cursor-pointer group">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>brush</span>
            </div>
          </div>
          <h4 className="font-h3 text-on-background mb-2">Adjectives</h4>
          <p className="font-body-md text-on-surface-variant mb-6 flex-grow">Describing the world with i-adjectives and na-adjectives.</p>
          
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full w-0"></div>
            </div>
            <span className="font-label-caps text-on-surface-variant">0%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Lessons;
