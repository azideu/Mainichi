import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';

const mockDeck = [
  { id: 1, kanji: '水', furigana: 'みず', english: 'Water', audio: true },
  { id: 2, kanji: '火', furigana: 'ひ', english: 'Fire', audio: true },
  { id: 3, kanji: '木', furigana: 'き', english: 'Tree/Wood', audio: true }
];

const Flashcard = () => {
  const navigate = useNavigate();
  const { recordReview } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = mockDeck[currentIndex];

  const handleReveal = () => {
    setIsFlipped(true);
  };

  const handleRating = (rating) => {
    recordReview(currentCard.id, rating);
    if (currentIndex < mockDeck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in">
        <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mb-md">
          <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
        </div>
        <h2 className="font-h2 text-on-surface mb-sm">Review Complete!</h2>
        <p className="font-body-md text-on-surface-variant mb-lg">Great job keeping up with your studies.</p>
        <Button3D onClick={() => navigate('/')}>Return to Dashboard</Button3D>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4 animate-in fade-in">
      <div className="w-full flex justify-between items-center mb-md">
        <button onClick={() => navigate(-1)} className="text-primary p-2 rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex-1 px-4">
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / mockDeck.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <span className="font-label-caps text-on-surface-variant">{currentIndex + 1}/{mockDeck.length}</span>
      </div>

      <div className="w-full max-w-md mb-xs text-center">
        <h2 className="font-label-caps text-on-surface-variant uppercase tracking-wider">JLPT N5 Core</h2>
      </div>

      <div className="perspective-1000 w-full max-w-md h-[350px] mb-md relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentCard.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute inset-0 bg-surface-container-lowest rounded-xl p-md flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(155,69,0,0.05)] border border-surface-variant ${isFlipped ? 'bg-surface-container' : ''}`}
          >
            {isFlipped ? (
              <div className="flex flex-col items-center text-center">
                <p className="font-body-lg text-on-surface-variant mb-2">{currentCard.furigana}</p>
                <h1 className="font-display-jp text-[48px] text-on-surface mb-6">{currentCard.kanji}</h1>
                <p className="font-h3 text-primary">{currentCard.english}</p>
              </div>
            ) : (
              <h1 className="font-display-jp text-[64px] text-on-surface">{currentCard.kanji}</h1>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full max-w-md mt-auto mb-4">
        {!isFlipped ? (
          <Button3D onClick={handleReveal}>Reveal Answer</Button3D>
        ) : (
          <div className="w-full flex justify-between gap-sm animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => handleRating('hard')}
              className="flex-1 bg-surface-container border-2 border-outline-variant text-on-surface-variant font-button-text py-3 rounded-lg flex flex-col items-center justify-center active:bg-surface-variant transition-colors"
            >
              <span className="text-sm font-normal mb-1">Hard</span>
              <span className="text-xs opacity-70">1m</span>
            </button>
            <button 
              onClick={() => handleRating('good')}
              className="flex-1 bg-tertiary border-2 border-tertiary text-on-tertiary font-button-text py-3 rounded-lg flex flex-col items-center justify-center active:scale-95 transition-transform shadow-[0_4px_0_#104648]"
            >
              <span className="text-sm font-normal mb-1">Good</span>
              <span className="text-xs opacity-80">10m</span>
            </button>
            <button 
              onClick={() => handleRating('easy')}
              className="flex-1 bg-surface-container border-2 border-outline-variant text-on-surface-variant font-button-text py-3 rounded-lg flex flex-col items-center justify-center active:bg-surface-variant transition-colors"
            >
              <span className="text-sm font-normal mb-1">Easy</span>
              <span className="text-xs opacity-70">4d</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
