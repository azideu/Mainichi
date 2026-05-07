import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Button3D from '../components/Button3D';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { streak, masteredWords } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

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
    <div className="animate-in fade-in max-w-2xl mx-auto">
      <h2 className="font-h1 text-primary mb-6">Profile</h2>
      
      <div className="bg-surface-container-lowest rounded-xl p-md mb-6 shadow-ambient shadow-primary/5 border border-surface-variant text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary-container shadow-md bg-surface-container">
            <img 
              src={profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mainichi'} 
              alt="User avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-h2 text-on-surface">{user?.name || 'User'}</h3>
        <p className="font-body-md text-on-surface-variant mb-6">{user?.email || 'user@example.com'}</p>
        
        <div className="flex justify-center gap-4">
          <div className="bg-primary-container/20 px-6 py-3 rounded-xl flex flex-col items-center">
            <span className="font-h2 text-primary">{streak}</span>
            <span className="font-label-caps text-on-surface-variant">Day Streak</span>
          </div>
          <div className="bg-secondary-container/20 px-6 py-3 rounded-xl flex flex-col items-center">
            <span className="font-h2 text-secondary">{masteredWords}</span>
            <span className="font-label-caps text-on-surface-variant">Words Mastered</span>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest rounded-xl p-md shadow-ambient shadow-primary/5 border border-surface-variant text-center">
        <h3 className="font-h3 text-on-surface mb-6">Edit Profile Info</h3>
        
        <div className="mb-8">
          <label className="block font-label-caps text-on-surface-variant mb-4">Choose Avatar</label>
          <div className="flex flex-wrap justify-center gap-4">
            {/* Upload Button */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="w-14 h-14 rounded-full bg-surface-container border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-primary hover:bg-primary/5 transition-colors group"
            >
              <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
              <span className="text-[8px] font-bold">ADD PHOTO</span>
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
                className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${profilePicture === url ? 'border-primary scale-110 shadow-md ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-surface-variant mb-8 w-1/2 mx-auto" />

        <form className="space-y-4 text-left max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block font-label-caps text-on-surface-variant mb-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Your Name"
            />
          </div>
          
          <div className="pt-6">
            <Button3D variant="primary" type="button" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button3D>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
