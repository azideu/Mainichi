import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';
import { useDialog } from '../context/DialogContext';
import LoadingState from '../components/LoadingState';
import { sendToAppInventor, APP_INVENTOR_ACTIONS } from '../utils/appInventorBridge';

const getFirstReading = (readingStr) => {
  if (!readingStr) return '';
  return readingStr.split(/[,、;]/)[0].trim();
};

const getQueueKanjiFontSize = (text) => {
  if (!text) return 'text-[72px] md:text-[96px]';
  const len = text.length;
  if (len <= 1) return 'text-[76px] md:text-[100px]';
  if (len === 2) return 'text-[52px] md:text-[68px]';
  if (len === 3) return 'text-[38px] md:text-[50px]';
  return 'text-[28px] md:text-[36px]';
};

const Review = () => {
  const navigate = useNavigate();
  const { isMobileApp } = useApp();
  const { showAlert, showConfirm } = useDialog();
  const [loading, setLoading] = useState(true);
  const [dueCount, setDueCount] = useState(0);
  const [dueCards, setDueCards] = useState([]);
  const [activeQueueIndex, setActiveQueueIndex] = useState(0);
  const [customDecks, setCustomDecks] = useState([]);

  const fetchReviewData = async () => {
    try {
      const token = localStorage.getItem('mainichi_token');
      const tzOffset = new Date().getTimezoneOffset().toString();

      // 1. Fetch all decks
      const decksRes = await fetch('/api/decks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!decksRes.ok) throw new Error("Failed to fetch decks");
      const allDecks = await decksRes.json();

      // 2. Fetch due count for N5 Core (deck 1)
      const due1Res = await fetch(`/api/progress/due?tzOffset=${tzOffset}&deckId=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Timezone-Offset': tzOffset
        }
      });
      if (due1Res.ok) {
        const due1Data = await due1Res.json();
        setDueCount(due1Data.length);
        setDueCards(due1Data);
      }

      // 3. Filter custom downloaded decks
      const downloadedDecks = allDecks.filter(d => d.id !== 1 && d.downloaded);

      // 4. Fetch due counts for each downloaded custom deck
      const decksWithDue = await Promise.all(downloadedDecks.map(async (deck) => {
        try {
          const res = await fetch(`/api/progress/due?tzOffset=${tzOffset}&deckId=${deck.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-Timezone-Offset': tzOffset
            }
          });
          if (res.ok) {
            const data = await res.json();
            return { ...deck, dueCount: data.length };
          }
        } catch (e) {
          console.error(`Failed to fetch due for deck ${deck.id}`, e);
        }
        return { ...deck, dueCount: 0 };
      }));

      setCustomDecks(decksWithDue);
    } catch (err) {
      console.error("Failed to fetch review data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, []);

  useEffect(() => {
    setActiveQueueIndex(0);
    if (dueCards.length <= 1) return;
    const interval = setInterval(() => {
      setActiveQueueIndex((prev) => (prev + 1) % dueCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dueCards]);

  const handleRemoveDeck = async (deckId) => {
    const confirmed = await showConfirm("Are you sure you want to remove this deck and all its study records from your account?", "Remove Deck");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('mainichi_token');
      const res = await fetch(`/api/decks/${deckId}/download`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        await fetchReviewData();
      } else {
        await showAlert("Failed to remove deck. Please try again.", "Error");
      }
    } catch (err) {
      console.error("Failed to remove deck", err);
      await showAlert("Error occurred while removing deck.", "Error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  if (loading) {
    return <LoadingState message="Consulting the archives..." />;
  }

  // Calculate total active reviews count
  const totalReviewsCount = dueCount + customDecks.reduce((sum, d) => sum + d.dueCount, 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-4xl mx-auto pb-6 md:pb-xl px-2 sm:px-4">
      <motion.div variants={itemVariants} className="hidden md:flex justify-between items-end mb-4 md:mb-8">
        <div>
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Reviews</h1>
          <p className="font-body-md text-outline tracking-wide">Your daily SRS queue</p>
        </div>
        <div className="w-14 h-14 bg-surface-bright border border-primary/20 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors"></div>
          <span className="font-h2 text-primary relative z-10">{totalReviewsCount}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-6 md:p-10 border border-outline/10 shadow-paper-layer mb-6 md:mb-12 relative overflow-hidden group flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center w-full max-w-lg">

          {/* Circular Kanji Preview */}
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full bg-surface-bright border-2 border-primary/20 flex items-center justify-center shadow-md relative overflow-hidden mb-2 group-hover:border-primary/40 transition-colors duration-300">
            {dueCount > 0 && dueCards.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQueueIndex}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute flex items-center justify-center w-full h-full p-4"
                >
                  <span className={`${getQueueKanjiFontSize(dueCards[activeQueueIndex].kanji)} font-bold text-primary leading-none`} style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {dueCards[activeQueueIndex].kanji}
                  </span>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center text-primary/30 p-4">
                <span className="material-symbols-outlined text-[54px] md:text-[64px] animate-pulse" style={{ fontVariationSettings: "'wght' 120" }}>spa</span>
              </div>
            )}
          </div>

          {/* Reading Display */}
          {dueCount > 0 && dueCards.length > 0 ? (
            <div className="h-6 mb-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeQueueIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="font-body-md text-on-surface-variant font-medium tracking-normal block"
                >
                  {getFirstReading(dueCards[activeQueueIndex].furigana)}
                </motion.span>
              </AnimatePresence>
            </div>
          ) : (
            <div className="h-6 mb-4"></div>
          )}

          {/* Deck Metadata & Title */}
          <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
            <span className="font-label-caps tracking-widest text-[9px] text-outline">MAIN DECK</span>
          </div>

          <h3 className="font-h1 text-on-surface mb-2 tracking-tight text-[28px] md:text-[36px]">JLPT N5 Core</h3>

          <p className="font-body-md text-on-surface-variant mb-6 max-w-sm">
            {dueCount > 0 ? (
              <span>
                You have <strong className="text-primary font-semibold">{dueCount}</strong> {dueCount === 1 ? 'card' : 'cards'} due for review.
              </span>
            ) : (
              "You're all caught up on your reviews! Check back later."
            )}
          </p>

          <Button3D onClick={() => {
            if (isMobileApp) {
              sendToAppInventor(APP_INVENTOR_ACTIONS.VIBRATE, { duration: 100 });
            }
            navigate('/flashcard?deckId=1');
          }} variant="primary" disabled={dueCount === 0} className="w-full sm:w-auto px-10">
            {dueCount > 0 ? 'Review' : 'Nothing Due'}
          </Button3D>

          {dueCount > 1 && dueCards.length > 1 && (
            <div className="mt-4 flex items-center justify-center bg-surface-variant/40 px-3 py-1 rounded-full border border-outline/5">
              <span className="font-label-caps text-[9px] text-outline tracking-wider font-semibold">
                QUEUE: {activeQueueIndex + 1} / {dueCards.length}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.h2 variants={itemVariants} className="font-h3 text-on-surface mb-4 md:mb-6 flex items-center gap-4">
        Custom Decks
        <div className="h-[1px] flex-1 bg-outline/20"></div>
      </motion.h2>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {customDecks.map((deck) => (
          <motion.div
            key={deck.id}
            variants={itemVariants}
            className="bg-surface rounded-xl p-4 md:p-6 border border-outline/10 shadow-paper-layer relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-h3 text-on-surface tracking-tight line-clamp-1">{deck.title}</h3>
                  <span className="font-label-caps text-[9px] text-outline px-2 py-0.5 bg-surface-variant/30 rounded-full border border-outline/5 whitespace-nowrap">
                    By {deck.author}
                  </span>
                </div>
                <p className="font-body-sm text-outline mb-4 md:mb-6 line-clamp-2">{deck.description || "No description provided."}</p>
              </div>

              <div className="mt-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body-md text-on-surface-variant font-medium">
                    {deck.dueCount} {deck.dueCount === 1 ? 'card' : 'cards'} due
                  </span>
                  {deck.word_count !== undefined && (
                    <span className="font-label-caps text-[10px] text-outline">
                      {deck.word_count} total cards
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button3D
                    onClick={() => {
                      if (isMobileApp) {
                        sendToAppInventor(APP_INVENTOR_ACTIONS.VIBRATE, { duration: 100 });
                      }
                      navigate(`/flashcard?deckId=${deck.id}`);
                    }}
                    variant="primary"
                    className="flex-1"
                    disabled={deck.dueCount === 0}
                  >
                    {deck.dueCount > 0 ? 'Review' : 'Nothing Due'}
                  </Button3D>
                  <button
                    onClick={() => handleRemoveDeck(deck.id)}
                    className="p-3 rounded-xl bg-surface border border-error/20 hover:bg-error/5 hover:border-error/40 text-error/70 hover:text-error transition-all shadow-sm flex items-center justify-center active:scale-[0.98]"
                    title="Remove Deck"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Action button to explore and create new custom decks */}
        <div
          onClick={() => navigate('/community')}
          className="border border-dashed border-outline/30 rounded-xl p-6 md:p-10 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 hover:bg-surface/50 transition-all cursor-pointer group min-h-[140px] md:min-h-[180px]"
        >
          <span className="material-symbols-outlined text-[48px] text-outline mb-4 group-hover:scale-110 transition-transform duration-500 ease-out" style={{ fontVariationSettings: "'wght' 200" }}>note_add</span>
          <p className="font-label-caps tracking-widest text-outline">DISCOVER DECKS</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Review;
