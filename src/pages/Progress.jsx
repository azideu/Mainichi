import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import MasteryRing from '../components/MasteryRing';
import Button3D from '../components/Button3D';

const Progress = () => {
  const { user, logout } = useAuth();
  const { streak, masteredWords } = useApp();

  return (
    <div className="animate-in fade-in max-w-md mx-auto">
      <div className="flex flex-col items-center mb-xl">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container mb-4">
          <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh4KuvQk9ObilNoyVYD3socfuAYe31_rOs23VAMSuZbDDLPtK_goQ20pk9Vv07d507e09Qi2VoDqfep8E1IcCO1ijTfAEil6bvkQwekWKWxymqw-BXY6ZHq2IZMnY9dJ9flJAo2zihS9MCpG2Ams5HiiS4WYClvx_AjOnmtYemg1YSZ7fwHDMXpGWUsjNMf_PLos0WlQ-qb2uglxuyonIHGQ_YCZnyPyg7X0cDR5ue5lrPsupyw7sxlSPlS6xBcPEb2hkn_UDX_as" />
        </div>
        <h2 className="font-h2 text-on-surface">{user?.name || 'Student'}</h2>
        <p className="font-body-md text-on-surface-variant">{user?.email || 'student@example.com'}</p>
      </div>

      <div className="grid grid-cols-2 gap-md mb-xl">
        <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant flex flex-col items-center">
          <span className="material-symbols-outlined text-[32px] text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <h3 className="font-h2 text-primary">{streak}</h3>
          <p className="font-label-caps text-on-surface-variant text-center">Day Streak</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant flex flex-col items-center">
          <span className="material-symbols-outlined text-[32px] text-tertiary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>translate</span>
          <h3 className="font-h2 text-tertiary">{masteredWords}</h3>
          <p className="font-label-caps text-on-surface-variant text-center">Words Mastered</p>
        </div>
      </div>

      <div className="mb-xl">
        <h3 className="font-h3 text-on-surface mb-4">Learning Analytics</h3>
        <MasteryRing progress={65} total={100} label="Grammar Accuracy %" />
      </div>

      <div className="space-y-4">
        <h3 className="font-h3 text-on-surface mb-2">Account</h3>
        <button className="w-full bg-surface-container-lowest p-4 rounded-xl border border-surface-variant flex justify-between items-center active:bg-surface-container transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            <span className="font-body-md text-on-surface">Settings</span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
        </button>
        <button onClick={logout} className="w-full bg-error-container p-4 rounded-xl border border-error/20 flex justify-between items-center active:opacity-80 transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">logout</span>
            <span className="font-body-md text-error">Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Progress;
