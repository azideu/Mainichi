import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';

const Review = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-end mb-md">
        <div>
          <h1 className="font-h1 text-on-surface">Reviews</h1>
          <p className="font-body-md text-on-surface-variant">Your daily SRS queue</p>
        </div>
        <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center">
          <span className="font-h3 text-on-primary-container">15</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-md border border-surface-variant shadow-[0_4px_12px_rgba(0,0,0,0.04)] mb-md">
        <h3 className="font-h3 text-on-surface mb-2">JLPT N5 Core</h3>
        <p className="font-body-md text-on-surface-variant mb-4">15 cards due for review</p>
        <Button3D onClick={() => navigate('/flashcard')}>Start Review</Button3D>
      </div>

      <h2 className="font-h2 text-on-surface mb-sm">Custom Decks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {/* Empty state for custom decks */}
        <div className="border-2 border-dashed border-outline-variant rounded-xl p-md flex flex-col items-center justify-center text-center opacity-70">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">note_add</span>
          <p className="font-body-md text-on-surface-variant">Create a custom deck</p>
        </div>
      </div>
    </div>
  );
};

export default Review;
