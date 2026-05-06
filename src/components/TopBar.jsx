import React from 'react';

const TopBar = () => {
  return (
    <header className="bg-surface-container-lowest border-b border-surface-variant shadow-sm flex justify-between items-center w-full px-5 py-3 h-16 z-50 sticky top-0">
      <button className="text-primary transition-transform active:scale-95 duration-150 hover:bg-surface-container p-2 rounded-full">
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>
      <h1 className="text-primary font-h3 tracking-tight">Mainichi</h1>
      <button className="transition-transform active:scale-95 duration-150 rounded-full overflow-hidden w-8 h-8 border border-outline-variant">
        <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh4KuvQk9ObilNoyVYD3socfuAYe31_rOs23VAMSuZbDDLPtK_goQ20pk9Vv07d507e09Qi2VoDqfep8E1IcCO1ijTfAEil6bvkQwekWKWxymqw-BXY6ZHq2IZMnY9dJ9flJAo2zihS9MCpG2Ams5HiiS4WYClvx_AjOnmtYemg1YSZ7fwHDMXpGWUsjNMf_PLos0WlQ-qb2uglxuyonIHGQ_YCZnyPyg7X0cDR5ue5lrPsupyw7sxlSPlS6xBcPEb2hkn_UDX_as" />
      </button>
    </header>
  );
};

export default TopBar;
