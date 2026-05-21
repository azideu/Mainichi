import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Button3D from '../components/Button3D';

const Profile = () => {
  const { user, updateProfile, setIsPremiumModalOpen } = useAuth();
  const { streak, masteredWords } = useApp();
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-2xl mx-auto pb-xl">
      <motion.h2 variants={itemVariants} className="font-h1 text-primary mb-8 tracking-tighter">Profile</motion.h2>
      
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg mb-8 shadow-paper-layer border border-outline/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
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
        
        <div className="flex justify-center gap-6 relative z-10">
          <div className="bg-primary/5 border border-primary/10 px-8 py-4 rounded-xl flex flex-col items-center">
            <span className="font-h2 text-primary">{streak}</span>
            <span className="font-label-caps text-outline tracking-widest text-[10px] mt-1">DAY STREAK</span>
          </div>
          <div className="bg-secondary/5 border border-secondary/10 px-8 py-4 rounded-2xl flex flex-col items-center">
            <span className="font-h2 text-secondary">{masteredWords}</span>
            <span className="font-label-caps text-outline tracking-widest text-[10px] mt-1">MASTERED</span>
          </div>
        </div>
      </motion.div>

      {/* Subscription Status Card */}
      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-6 mb-8 shadow-paper-layer border border-outline/10 relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="font-label-caps text-outline tracking-widest text-[10px] mb-1">MEMBERSHIP STATUS</h4>
            <div className="flex items-center gap-2">
              <h3 className="font-h3 text-on-surface">
                {user?.is_premium === 1 ? 'Mainichi Premium' : 'Mainichi Explorer (Free Tier)'}
              </h3>
              {user?.is_premium === 1 && (
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-label-caps font-bold px-2 py-0.5 rounded-full text-[9px] tracking-wider flex items-center gap-0.5 shadow-sm">
                  <span className="material-symbols-outlined text-[10px] font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ACTIVE
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
          ) : (
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-3xl p-lg shadow-paper-layer border border-outline/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <h3 className="font-h3 text-on-surface mb-8 tracking-tight relative z-10">Edit Identity</h3>
        
        <div className="mb-10 relative z-10">
          <label className="block font-label-caps tracking-widest text-outline mb-4">CHOOSE AVATAR</label>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Upload Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-16 h-16 rounded-xl bg-surface-bright border border-dashed border-primary/30 flex flex-col items-center justify-center text-primary hover:bg-primary/5 transition-all group"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>add_a_photo</span>
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
                className={`w-16 h-16 rounded-2xl overflow-hidden border transition-all ${profilePicture === url ? 'border-primary scale-110 shadow-paper-layer' : 'border-outline/10 opacity-70 hover:opacity-100 hover:border-outline/30'}`}
              >
                <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-outline/10 mb-10 w-1/3 mx-auto relative z-10" />

        <form className="space-y-6 text-left max-w-sm mx-auto relative z-10" onSubmit={(e) => e.preventDefault()}>
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
    </motion.div>
  );
};

export default Profile;
