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
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in max-w-md mx-auto text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="w-28 h-28 rounded-2xl bg-surface-bright border border-primary/20 flex items-center justify-center mb-8 relative overflow-hidden shadow-paper-layer"
        >
          <div className="absolute inset-0 bg-primary/10"></div>
          <span className="material-symbols-outlined text-[56px] text-primary relative z-10" style={{ fontVariationSettings: "'wght' 200" }}>spa</span>
        </motion.div>
        <h2 className="font-h1 text-on-surface mb-4 tracking-tighter">Review Complete</h2>
        <p className="font-body-md text-outline mb-10 leading-relaxed">Great job keeping up with your studies. The path to mastery is built on daily steps.</p>
        <Button3D onClick={() => navigate('/')} variant="primary">Return to Sanctuary</Button3D>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full pt-4 animate-in fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="w-full flex justify-between items-center mb-8 bg-surface-bright/50 p-2 rounded-full border border-outline/10 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="text-outline hover:text-primary p-2 rounded-full hover:bg-surface transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 300" }}>close</span>
        </button>
        <div className="flex-1 px-4">
          <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentIndex / mockDeck.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <span className="font-label-caps text-outline tracking-widest px-3">{currentIndex + 1}/{mockDeck.length}</span>
      </div>

      <div className="w-full mb-6 text-center">
        <h2 className="font-label-caps text-outline tracking-[0.2em]">JLPT N5 CORE</h2>
      </div>

      {/* Card Area */}
      <div className="perspective-1000 w-full h-[400px] mb-10 relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentCard.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`absolute inset-0 rounded-xl p-8 flex flex-col items-center justify-center shadow-paper-layer border border-outline/10 overflow-hidden ${isFlipped ? 'bg-surface-bright' : 'bg-surface'}`}
          >
            {/* Washi Texture */}
            <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none"></div>
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              {isFlipped ? (
                <div className="flex flex-col items-center text-center">
                  <p className="font-body-lg text-outline mb-4 tracking-widest">{currentCard.furigana}</p>
                  <h1 className="font-h1 text-[64px] text-on-surface mb-8 opacity-90">{currentCard.kanji}</h1>
                  <div className="h-[1px] w-12 bg-primary/30 mb-6"></div>
                  <p className="font-h3 text-primary tracking-wide">{currentCard.english}</p>
                </div>
              ) : (
                <h1 className="font-h1 text-[80px] text-on-surface opacity-90">{currentCard.kanji}</h1>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Area */}
      <div className="w-full mt-auto mb-6 px-4">
        {!isFlipped ? (
          <Button3D onClick={handleReveal} variant="primary" className="w-full">
            Reveal Answer
          </Button3D>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full flex justify-between gap-4"
          >
            <button 
              onClick={() => handleRating('hard')}
              className="flex-1 bg-surface border border-outline/20 text-on-surface-variant py-4 rounded-2xl flex flex-col items-center justify-center hover:bg-surface-bright hover:border-outline/40 transition-all active:scale-95 shadow-sm"
            >
              <span className="font-label-caps tracking-widest mb-1 text-[10px]">HARD</span>
              <span className="font-body-md text-xs opacity-50">1m</span>
            </button>
            <button 
              onClick={() => handleRating('good')}
              className="flex-[1.5] bg-surface-bright border border-primary/30 text-primary py-4 rounded-xl flex flex-col items-center justify-center active:scale-95 transition-all shadow-paper-layer hover:bg-primary/5 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 hover:opacity-100 transition-opacity"></div>
              <span className="font-label-caps tracking-widest mb-1 text-[10px] relative z-10">GOOD</span>
              <span className="font-body-md text-xs opacity-70 relative z-10">10m</span>
            </button>
            <button 
              onClick={() => handleRating('easy')}
              className="flex-1 bg-surface border border-outline/20 text-on-surface-variant py-4 rounded-2xl flex flex-col items-center justify-center hover:bg-surface-bright hover:border-outline/40 transition-all active:scale-95 shadow-sm"
            >
              <span className="font-label-caps tracking-widest mb-1 text-[10px]">EASY</span>
              <span className="font-body-md text-xs opacity-50">4d</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
