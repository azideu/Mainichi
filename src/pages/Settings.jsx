import React from 'react';
import Button3D from '../components/Button3D';

const Settings = () => {
  return (
    <div className="animate-in fade-in max-w-2xl mx-auto">
      <h2 className="font-h1 text-primary mb-6">Settings</h2>
      
      <div className="bg-surface-container-lowest rounded-xl p-md mb-6 shadow-sm border border-surface-variant">
        <h3 className="font-h3 text-on-surface mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface">Daily Reminders</p>
              <p className="font-label-caps text-on-surface-variant">Get reminded to keep your streak alive</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="h-[1px] bg-surface-variant" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body-md text-on-surface">Community Updates</p>
              <p className="font-label-caps text-on-surface-variant">Notifications from your friends</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-surface-variant">
        <h3 className="font-h3 text-error mb-4">Danger Zone</h3>
        <p className="font-body-md text-on-surface-variant mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2 border-2 border-error text-error font-button-text rounded-lg hover:bg-error/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
