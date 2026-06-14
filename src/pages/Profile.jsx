import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';

const Profile = () => {
  const { user, updateProfile, setIsPremiumModalOpen, logout } = useAuth();
  const { streak, masteredWords } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  const avatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Kimberly',
  ];

  const handleSave = async () => {
    setIsUpdating(true);
    const success = await updateProfile(name, profilePicture);
    if (success) {
      alert("Profile updated successfully!");
    }
    setIsUpdating(false);
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400; // Target size for avatar

        // Calculate crop dimensions to make it square (center crop)
        let width = img.width;
        let height = img.height;
        let offsetX = 0;
        let offsetY = 0;

        if (width > height) {
          offsetX = (width - height) / 2;
          width = height;
        } else {
          offsetY = (height - width) / 2;
          height = width;
        }

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext('2d');
        // Draw the center-cropped part of the image onto the canvas
        ctx.drawImage(img, offsetX, offsetY, width, height, 0, 0, MAX_SIZE, MAX_SIZE);

        // Convert to compressed JPEG (automatically keeps it well under 1MB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfilePicture(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-3xl mx-auto pb-6 md:pb-xl px-2 sm:px-4">
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-4 md:p-lg mb-4 md:mb-8 shadow-paper-layer border border-outline/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        
        {/* Settings shortcut inside profile card */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-surface-variant/40 hover:bg-surface-variant text-outline hover:text-primary rounded-xl transition-all duration-200 active:scale-95 border border-outline/10 shadow-sm"
          title="Settings"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>settings</span>
        </button>

        <div className="relative z-10 w-28 h-28 mx-auto mb-6 bg-surface-bright rounded-xl p-1 border border-primary/20 shadow-sm">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply z-10 pointer-events-none"></div>
            <img
              src={profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'}
              alt="User avatar"
              className="w-full h-full object-cover relative z-0"
            />
          </div>
        </div>
        <h3 className="font-h2 text-on-surface tracking-tight mb-1 relative z-10">{user?.name || 'Wanderer'}</h3>
        <p className="font-body-md text-outline mb-8 relative z-10 tracking-wide">{user?.email || 'journey@mainichi.app'}</p>

        <div className="flex justify-center gap-3 md:gap-6 relative z-10">
          <div className="bg-primary/5 border border-primary/10 px-4 py-3 md:px-8 md:py-4 rounded-xl flex flex-col items-center">
            <span className="font-h2 text-primary">{streak}</span>
            <span className="font-label-caps text-outline tracking-widest text-[10px] mt-1">DAY STREAK</span>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 px-4 py-3 md:px-8 md:py-4 rounded-2xl flex flex-col items-center">
            <span className="font-h2 text-secondary">{masteredWords}</span>
            <span className="font-label-caps text-outline tracking-widest text-[10px] mt-1">MASTERED</span>
          </div>
        </div>
      </motion.div>

      {/* Subscription Status Card */}
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-4 md:p-6 mb-4 md:mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-label-caps text-outline tracking-widest text-[10px] mb-1">MEMBERSHIP STATUS</h4>
            <div className="flex items-center gap-2">
              <h3 className="font-h3 text-on-surface">
                {user?.is_premium === 1 ? 'Mainichi Premium' : 'Mainichi Explorer (Free Tier)'}
              </h3>
              {user?.is_premium === 1 && (
                <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-label-caps px-2 py-0.5 rounded-full tracking-widest whitespace-nowrap shrink-0">
                  PREMIUM
                </span>
              )}
            </div>
            <p className="font-body-md text-on-surface-variant mt-1.5 leading-relaxed">
              {user?.is_premium === 1
                ? 'Thank you for supporting our Cozy Japanese learning project! You have unlocked all premium collections and custom study tools.'
                : 'Unlock dynamic vocabulary paths, uncapped review queues, and all curated community decks.'}
            </p>
          </div>

          {user?.is_premium !== 1 ? (
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-primary/95 text-on-primary font-label-caps tracking-widest text-[10px] font-bold rounded-xl transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
            >
              Upgrade • RM10/mo
            </button>
          ) : null}
        </div>
      </motion.div>

      {/* Study Progress Link */}
      <motion.div
        variants={itemVariants}
        onClick={() => navigate('/progress')}
        className="bg-surface rounded-2xl p-4 md:p-5 mb-4 md:mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden text-left group hover:border-primary/20 cursor-pointer transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>auto_graph</span>
            </div>
            <div>
              <h4 className="font-body-lg font-bold text-on-surface">Study Progress & Stickers</h4>
              <p className="font-label-caps text-outline tracking-widest text-[9px] mt-0.5">VIEW YOUR FOREST PATH & MILESTONES</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-4 md:p-lg shadow-paper-layer border border-outline/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-4 md:mb-8 tracking-tight relative z-10">Edit Identity</h3>

        <div className="mb-6 md:mb-10 relative z-10">
          <label className="block font-label-caps tracking-widest text-outline mb-3 md:mb-4">CHOOSE AVATAR</label>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-surface-bright border border-dashed border-primary/30 flex flex-col items-center justify-center text-primary hover:bg-primary/5 transition-all group"
            >
              <span className="material-symbols-outlined text-[20px] md:text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>add_a_photo</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            {avatars.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setProfilePicture(url)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden border transition-all ${profilePicture === url ? 'border-primary scale-110 shadow-paper-layer' : 'border-outline/10 opacity-70 hover:opacity-100 hover:border-outline/30'}`}
              >
                <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-outline/10 mb-6 md:mb-10 w-1/3 mx-auto relative z-10" />

        <form className="space-y-4 md:space-y-6 text-left max-w-sm mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block font-label-caps tracking-widest text-outline mb-2 ml-1">DISPLAY NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-4 rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
              placeholder="Your Name"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <Button3D variant="primary" type="button" onClick={handleSave} disabled={isUpdating} className="w-full">
              {isUpdating ? 'Saving Changes...' : 'Save Changes'}
            </Button3D>
          </div>
        </form>
      </motion.div>

      {/* Mobile-only Logout Button */}
      <motion.div variants={itemVariants} className="md:hidden pt-4 pb-8 flex justify-center">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="flex items-center justify-center gap-2 text-outline hover:text-error font-label-caps tracking-widest text-xs py-3 px-6 hover:bg-error/5 rounded-xl transition-all w-full border border-outline/10 bg-surface/50"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 200" }}>logout</span>
          DEPART
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
