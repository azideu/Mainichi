import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';
import LoadingState from '../components/LoadingState';
import { speakText, sendToAppInventor, APP_INVENTOR_ACTIONS } from '../utils/appInventorBridge';

const STEPS = {
  RECALL: 'RECALL',
  MEANING: 'MEANING',
  ONYOMI: 'ONYOMI',
  KUNYOMI: 'KUNYOMI',
  FURIGANA: 'FURIGANA',
  RESULT: 'RESULT'
};

const getFirstReading = (readingStr) => {
  if (!readingStr) return '';
  // Split by comma, Japanese comma, or semicolon and take the first reading, trimmed
  return readingStr.split(/[,、;]/)[0].trim();
};

const getActiveSteps = (card) => {
  if (!card) return [STEPS.RECALL, STEPS.RESULT];
  
  if (card.deck_type === 'phrase') {
    return [STEPS.RECALL, STEPS.FURIGANA, STEPS.RESULT];
  }
  
  const steps = [STEPS.RECALL, STEPS.MEANING];
  if (card.onyomi && card.onyomi.trim() !== '') {
    steps.push(STEPS.ONYOMI);
  }
  if (card.kunyomi && card.kunyomi.trim() !== '') {
    steps.push(STEPS.KUNYOMI);
  }
  steps.push(STEPS.RESULT);
  return steps;
};

const getDynamicFontSize = (text) => {
  if (!text) return 'text-[104px] md:text-[140px]';
  const len = text.length;
  if (len <= 1) return 'text-[104px] md:text-[140px]';
  if (len === 2) return 'text-[76px] md:text-[104px]';
  if (len === 3) return 'text-[56px] md:text-[76px]';
  if (len === 4) return 'text-[42px] md:text-[56px]';
  if (len <= 8) return 'text-[28px] md:text-[38px]';
  return 'text-[18px] md:text-[24px] leading-normal px-4 text-center';
};

const Flashcard = () => {
  const navigate = useNavigate();
  const { recordReview, recordReviewOverride, isMobileApp } = useApp();
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(STEPS.RECALL);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState({ meaning: null, onyomi: null, kunyomi: null, furigana: null });
  const [options, setOptions] = useState({ meaning: [], onyomi: [], kunyomi: [], furigana: [] });
  const [fullDeckVocab, setFullDeckVocab] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');

  const currentCard = deck[currentIndex];
  const activeSteps = currentCard ? getActiveSteps(currentCard) : [];

  useEffect(() => {
    const fetchDue = async () => {
      try {
        const token = localStorage.getItem('mainichi_token');
        const tzOffset = new Date().getTimezoneOffset().toString();
        const searchParams = new URLSearchParams(window.location.search);
        const deckId = searchParams.get('deckId') || '1';
        
        let url = `/api/progress/due?tzOffset=${tzOffset}`;
        if (searchParams.get('deckId')) {
          url += `&deckId=${deckId}`;
        }

        const res = await fetch(url, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'X-Timezone-Offset': tzOffset
          }
        });

        const vocabRes = await fetch(`/api/decks/${deckId}/vocab`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        let dueData = [];
        let vocabData = [];

        if (res.ok) {
          dueData = await res.json();
          setDeck(dueData);
        }
        if (vocabRes.ok) {
          vocabData = await vocabRes.json();
          setFullDeckVocab(vocabData);
        }

        if (dueData.length > 0) {
          generateOptions(0, dueData, vocabData.length > 0 ? vocabData : dueData);
        }
      } catch (err) {
        console.error("Failed to fetch due cards", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDue();
  }, []);

  const generateOptions = (index, currentDeck, poolOverride) => {
    const card = currentDeck[index];
    const pool = poolOverride || (fullDeckVocab.length > 0 ? fullDeckVocab : currentDeck);
    
    const getDistractors = (attr, correctVal) => {
      const cleanCorrect = getFirstReading(correctVal);

      const distractors = pool
        .filter(c => c.id !== card.id)
        .map(c => getFirstReading(c[attr]))
        .filter(val => val && val !== cleanCorrect)
        .filter((val, idx, self) => self.indexOf(val) === idx);
      
      const shuffled = [...distractors].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);
      
      return [...selected, cleanCorrect].sort(() => 0.5 - Math.random());
    };

    setOptions({
      meaning: getDistractors('english', card.english),
      onyomi: (card.onyomi && card.onyomi.trim()) ? getDistractors('onyomi', card.onyomi) : [],
      kunyomi: (card.kunyomi && card.kunyomi.trim()) ? getDistractors('kunyomi', card.kunyomi) : [],
      furigana: (card.furigana && card.furigana.trim()) ? getDistractors('furigana', card.furigana) : []
    });
  };

  const shuffleDeck = React.useCallback(() => {
    if (deck.length <= 1) return;
    
    // Shuffle the items starting from the current index to the end
    const unstudied = deck.slice(currentIndex);
    if (unstudied.length <= 1) return;
    
    const shuffledUnstudied = [...unstudied].sort(() => 0.5 - Math.random());
    const newDeck = [
      ...deck.slice(0, currentIndex),
      ...shuffledUnstudied
    ];
    
    setDeck(newDeck);
    generateOptions(currentIndex, newDeck);
    
    // Vibrate device to confirm haptic shuffle action
    sendToAppInventor("VIBRATE");
  }, [deck, currentIndex, fullDeckVocab]);

  useEffect(() => {
    const handleShake = () => {
      console.log("Device shake detected: Shuffling deck...");
      shuffleDeck();
    };

    window.addEventListener('app-shake-event', handleShake);
    return () => {
      window.removeEventListener('app-shake-event', handleShake);
    };
  }, [shuffleDeck]);

  const handleSpeechRecognitionStart = () => {
    setIsListening(true);
    setSpeechFeedback('');
    sendToAppInventor("START_SPEECH_RECOGNITION");
    
    // Safety timeout in case speech recognizer is dismissed without returning anything
    setTimeout(() => {
      setIsListening(false);
    }, 8000);
  };

  useEffect(() => {
    const handleSpeechResult = async (event) => {
      setIsListening(false);
      const spokenText = event.detail;
      if (!spokenText) return;
      
      console.log("Speech recognition result received:", spokenText);
      setSpeechFeedback(`Heard: "${spokenText}"`);

      // Clean the string (remove spaces, punctuation, convert to lowercase)
      const clean = (str) => {
        if (!str) return '';
        return str.replace(/[\s\s、。,.?？!！]/g, '').toLowerCase();
      };
      
      if (!currentCard) return;

      const targetKanji = clean(currentCard.kanji);
      const targetFurigana = clean(currentCard.furigana);
      
      const spokenClean = clean(spokenText);
      
      const JAPANESE_NUMBERS_MAP = {
        '0': ['れい', 'ぜろ', '零', 'rei', 'zero'],
        '1': ['いち', '一', 'ichi'],
        '2': ['に', '二', 'ni'],
        '3': ['さん', '三', 'san'],
        '4': ['よん', 'し', '四', 'yon', 'shi'],
        '5': ['ご', '五', 'go'],
        '6': ['ろく', '六', 'roku'],
        '7': ['なな', 'しち', '七', 'nana', 'shichi'],
        '8': ['はち', '八', 'hachi'],
        '9': ['きゅう', 'く', '九', 'kyuu', 'ku'],
        '10': ['じゅう', '十', 'juu']
      };

      const spokenVariants = [spokenClean];
      if (JAPANESE_NUMBERS_MAP[spokenClean]) {
        spokenVariants.push(...JAPANESE_NUMBERS_MAP[spokenClean]);
      }
      
      const cleanList = (raw) => {
        if (!raw) return [];
        return raw.split(/[,、;]/).map(r => clean(r)).filter(Boolean);
      };
      
      const targetList = [
        targetKanji,
        targetFurigana,
        ...cleanList(currentCard.onyomi),
        ...cleanList(currentCard.kunyomi)
      ].filter(Boolean);
      
      let isMatch = targetList.some(target => {
        return spokenVariants.some(variant => 
          variant === target || variant.includes(target) || target.includes(variant)
        );
      });

      // Homophone / DB check (if direct match failed and spokenClean contains Kanji characters)
      if (!isMatch && spokenText && !/^[\u3040-\u309F\u30A0-\u30FF]+$/.test(spokenClean)) {
        try {
          const token = localStorage.getItem('mainichi_token');
          const res = await fetch(`/api/vocab/lookup?kanji=${encodeURIComponent(spokenText)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.readings && data.readings.length > 0) {
              const cleanReadings = data.readings.map(r => clean(r));
              isMatch = cleanReadings.some(reading => reading === targetFurigana);
            }
          }
        } catch (e) {
          console.error("Failed to perform homophone lookup", e);
        }
      }
      
      if (isMatch) {
        setResults({ meaning: true, onyomi: true, kunyomi: true, furigana: true });
        setStep(STEPS.RESULT);
        if (isMobileApp) {
          sendToAppInventor("PLAY_MEDIA", { file: "correct.mp3" });
        }
      } else {
        if (isMobileApp) {
          sendToAppInventor("VIBRATE", { duration: 200 });
        }
        setTimeout(() => {
          setSpeechFeedback('');
        }, 4000);
      }
    };

    window.addEventListener('app-speech-result', handleSpeechResult);
    return () => {
      window.removeEventListener('app-speech-result', handleSpeechResult);
    };
  }, [currentCard, isMobileApp]);

  const isAllCorrect = (() => {
    if (!currentCard) return false;
    let correct = true;
    if (activeSteps.includes(STEPS.MEANING) && results.meaning !== true) correct = false;
    if (activeSteps.includes(STEPS.ONYOMI) && results.onyomi !== true) correct = false;
    if (activeSteps.includes(STEPS.KUNYOMI) && results.kunyomi !== true) correct = false;
    if (activeSteps.includes(STEPS.FURIGANA) && results.furigana !== true) correct = false;
    return correct;
  })();

  const handleForgot = () => {
    setResults({ meaning: false, onyomi: false, kunyomi: false, furigana: false });
    setStep(STEPS.RESULT);
  };

  const handleOverrideClick = async () => {
    const correctedResults = { ...results };
    activeSteps.forEach(s => {
      if (s === STEPS.MEANING) correctedResults.meaning = true;
      if (s === STEPS.ONYOMI) correctedResults.onyomi = true;
      if (s === STEPS.KUNYOMI) correctedResults.kunyomi = true;
      if (s === STEPS.FURIGANA) correctedResults.furigana = true;
    });
    setResults(correctedResults);
    
    const data = await recordReviewOverride(currentCard.id, currentCard.deck_id);
    if (data && data.next_review_date) {
      const next = new Date(data.next_review_date);
      const now = new Date();
      const diffMs = next - now;
      const diffMins = Math.round(diffMs / (1000 * 60));
      
      if (diffMins < 60) {
        setNextReviewText(`${diffMins} minutes`);
      } else if (diffMins < 1440) {
        setNextReviewText(`${Math.round(diffMins / 60)} hours`);
      } else {
        setNextReviewText(`${Math.round(diffMins / 1440)} days`);
      }
    }
  };

  const handleChoice = (type, choice) => {
    let isCorrect = false;
    if (type === 'meaning') {
      isCorrect = choice === getFirstReading(currentCard.english);
    } else {
      isCorrect = choice === getFirstReading(currentCard[type]);
    }
    
    setResults(prev => ({ ...prev, [type]: isCorrect }));
    
    if (isMobileApp && !isCorrect) {
      sendToAppInventor(APP_INVENTOR_ACTIONS.VIBRATE, { duration: 200 });
    }
    
    const currentIdx = activeSteps.indexOf(step);
    if (currentIdx !== -1 && currentIdx < activeSteps.length - 1) {
      setStep(activeSteps[currentIdx + 1]);
    } else {
      setStep(STEPS.RESULT);
    }
  };

  const [nextReviewText, setNextReviewText] = useState('');

  useEffect(() => {
    if (step === STEPS.RESULT && currentCard) {
      const currentActiveSteps = getActiveSteps(currentCard);
      let allCorrect = true;
      if (currentActiveSteps.includes(STEPS.MEANING) && results.meaning !== true) allCorrect = false;
      if (currentActiveSteps.includes(STEPS.ONYOMI) && results.onyomi !== true) allCorrect = false;
      if (currentActiveSteps.includes(STEPS.KUNYOMI) && results.kunyomi !== true) allCorrect = false;
      if (currentActiveSteps.includes(STEPS.FURIGANA) && results.furigana !== true) allCorrect = false;

      const performRecord = async () => {
        const data = await recordReview(currentCard.id, allCorrect ? 'good' : 'hard', currentCard.deck_id);
        if (data && data.next_review_date) {
          const next = new Date(data.next_review_date);
          const now = new Date();
          const diffMs = next - now;
          const diffMins = Math.round(diffMs / (1000 * 60));
          
          if (diffMins < 60) {
            setNextReviewText(`${diffMins} minutes`);
          } else if (diffMins < 1440) {
            setNextReviewText(`${Math.round(diffMins / 60)} hours`);
          } else {
            setNextReviewText(`${Math.round(diffMins / 1440)} days`);
          }
        }
      };
      performRecord();
    }
  }, [step]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setStep(STEPS.RECALL);
      setResults({ meaning: null, onyomi: null, kunyomi: null });
      setNextReviewText('');
      generateOptions(nextIdx, deck);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return <LoadingState message="Consulting the archives..." />;
  }

  if (deck.length === 0 && !isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <span className="material-symbols-outlined text-[64px] text-primary/30 mb-6" style={{ fontVariationSettings: "'wght' 200" }}>auto_awesome</span>
        <h2 className="font-h2 text-on-surface mb-2">Queue Clear</h2>
        <p className="font-body-md text-outline mb-8">All your kanji are currently at rest.</p>
        <Button3D onClick={() => navigate('/dashboard')} variant="primary">Return Home</Button3D>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in max-w-md mx-auto text-center px-6">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20 shadow-paper-layer">
          <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
        </div>
        <h2 className="font-h1 text-on-surface mb-4 tracking-tighter">Garden Tended</h2>
        <p className="font-body-lg text-on-surface-variant mb-10 leading-relaxed">
          You've successfully reviewed all due kanji. Your path to mastery continues.
        </p>
        <Button3D onClick={() => navigate('/dashboard')} variant="primary" className="w-full">
          Return to Sanctuary
        </Button3D>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-[82vh] md:h-[85vh] flex flex-col justify-between pt-4 px-4">
      {/* Top Section: Top Bar & Centered Kanji */}
      <div className="flex flex-col flex-1 justify-between pb-2 w-full">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate('/dashboard')} className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <div className="flex-1 px-8">
            <div className="h-1.5 w-full bg-surface-variant rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentIndex / deck.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <span className="font-label-caps text-outline text-[10px] tracking-widest">{currentIndex + 1}/{deck.length}</span>
        </div>

        {/* Kanji Display (centered vertically in this top area) */}
        <div className="flex-1 flex flex-col items-center justify-center py-6 relative">
          <motion.div 
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            {/* Circular frame like Kanji Garden */}
            <div className="absolute inset-0 -m-8 md:-m-12 border-4 border-dashed border-outline/10 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="w-48 h-48 md:w-64 md:h-64 bg-surface rounded-full flex items-center justify-center shadow-paper-layer border border-outline/5 relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply"></div>
              <span className={`${getDynamicFontSize(currentCard.kanji)} font-bold text-on-surface relative z-10`}>
                {currentCard.kanji}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: Interaction Area */}
      <div className="flex-1 flex flex-col justify-end w-full">
        <AnimatePresence mode="wait">
          {step === STEPS.RECALL && (
            <motion.div 
              key="recall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col justify-between items-center text-center w-full pb-2"
            >
              {currentCard.deck_type === 'phrase' ? (
                <p className="font-body-lg text-outline leading-relaxed max-w-[320px] mb-6">
                  Recall the <span className="text-on-surface font-medium">furigana/reading</span> for this item.
                </p>
              ) : (
                <p className="font-body-lg text-outline leading-relaxed max-w-[320px] mb-6">
                  Recall the <span className="text-on-surface font-medium">meaning</span>
                  {activeSteps.includes(STEPS.ONYOMI) && (
                    <>
                      , <span className="text-on-surface font-medium">on'yomi</span>
                    </>
                  )}
                  {activeSteps.includes(STEPS.KUNYOMI) && (
                    <>
                      , and <span className="text-on-surface font-medium">kun'yomi</span>
                    </>
                  )}
                  {!activeSteps.includes(STEPS.ONYOMI) && !activeSteps.includes(STEPS.KUNYOMI) && (
                    <> and <span className="text-on-surface font-medium">reading</span></>
                  )} for this item.
                </p>
              )}
              <div className="w-full space-y-4 mt-auto">
                <Button3D 
                  onClick={() => setStep(currentCard.deck_type === 'phrase' ? STEPS.FURIGANA : STEPS.MEANING)} 
                  variant="primary" 
                  className="w-full py-6 text-[18px]"
                >
                  {currentCard.deck_type === 'phrase' ? "Recall reading" : "Recall readings"}
                </Button3D>
                {isMobileApp && (
                  <Button3D 
                    onClick={handleSpeechRecognitionStart} 
                    variant="secondary" 
                    className="w-full py-6 border-primary/20 text-[18px]"
                    disabled={isListening}
                  >
                    <span className="material-symbols-outlined text-primary text-[22px] animate-pulse">
                      {isListening ? 'graphic_eq' : 'mic'}
                    </span>
                    {isListening ? 'Listening...' : 'Speak Answer'}
                  </Button3D>
                )}
                {speechFeedback && (
                  <div className="text-center font-body-md text-error-container bg-error-container/10 border border-error-container/20 rounded-xl py-3 px-4 animate-in fade-in zoom-in-95">
                    <span className="text-error font-medium">{speechFeedback}</span>
                  </div>
                )}
                <button 
                  onClick={handleForgot}
                  className="w-full py-4 bg-surface-variant/30 rounded-xl text-outline font-label-caps tracking-widest hover:bg-surface-variant/50 transition-all border border-outline/5 text-[13px] font-semibold"
                >
                  Not sure?
                </button>
              </div>
            </motion.div>
          )}

          {(step === STEPS.MEANING || step === STEPS.ONYOMI || step === STEPS.KUNYOMI || step === STEPS.FURIGANA) && (
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between w-full pb-2"
            >
              <p className="font-label-caps text-outline text-center tracking-[0.2em] mb-4">
                CHOOSE THE {step}
              </p>
              <div className="space-y-3 md:space-y-4 flex-grow flex flex-col justify-center my-auto w-full py-2">
                {options[step.toLowerCase()]?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleChoice(step.toLowerCase(), opt)}
                    className="w-full py-5 px-4 md:py-6 md:px-6 bg-surface border border-outline/10 rounded-xl md:rounded-2xl font-bold text-on-surface hover:border-primary/50 hover:bg-primary/5 transition-all shadow-paper-layer text-center active:scale-[0.98] text-[18px] md:text-[22px]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleForgot}
                className="w-full py-4 text-outline font-label-caps tracking-widest hover:text-primary transition-colors mt-auto text-[13px] font-semibold"
              >
                Forgot?
              </button>
            </motion.div>
          )}

          {step === STEPS.RESULT && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col justify-between w-full pb-2"
            >
              <div className="space-y-4 flex-grow flex flex-col justify-center my-auto w-full">
                <div className="text-center space-y-1">
                  <h2 className={`font-h2 ${isAllCorrect ? 'text-primary' : 'text-error'}`}>
                    {isAllCorrect ? 'Correct!' : 'Incorrect'}
                  </h2>
                  {nextReviewText && (
                    <p className="font-body-md text-outline">
                      Review again in <span className="font-medium text-on-surface-variant">{nextReviewText}</span>
                    </p>
                  )}
                </div>

                <div className="bg-surface rounded-2xl md:rounded-3xl p-4 md:p-8 border border-outline/10 shadow-paper-layer relative overflow-hidden">
                  <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply"></div>
                  <div className="relative z-10 space-y-3 md:space-y-6">
                    {currentCard.deck_type === 'phrase' ? (
                      <>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">PHRASE / SENTENCE</span>
                          <span className="font-h3 text-on-surface font-semibold">
                            {currentCard.kanji}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">FURIGANA / READING</span>
                          <span className={`font-h2 ${results.furigana ? 'text-primary' : 'text-error'}`}>
                            {currentCard.furigana} {results.furigana === false && '✗'}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">ENGLISH MEANING</span>
                          <span className="font-h3 text-on-surface">
                            {currentCard.english}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {activeSteps.includes(STEPS.MEANING) && (
                          <div className="flex flex-col">
                            <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">MEANING</span>
                            <span className={`font-h3 ${results.meaning ? 'text-primary' : 'text-error'}`}>
                              {currentCard.english} {results.meaning === false && '✗'}
                            </span>
                          </div>
                        )}
                        {activeSteps.includes(STEPS.ONYOMI) && (
                          <div className="flex flex-col">
                            <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">ON'YOMI</span>
                            <span className={`font-h2 ${results.onyomi ? 'text-primary' : 'text-error'}`}>
                              {currentCard.onyomi} {results.onyomi === false && '✗'}
                            </span>
                          </div>
                        )}
                        {activeSteps.includes(STEPS.KUNYOMI) && (
                          <div className="flex flex-col">
                            <span className="font-label-caps text-outline text-[10px] tracking-widest mb-1">KUN'YOMI</span>
                            <span className={`font-h2 ${results.kunyomi ? 'text-primary' : 'text-error'}`}>
                              {currentCard.kunyomi} {results.kunyomi === false && '✗'}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {!isAllCorrect && (
                  <button
                    type="button"
                    onClick={handleOverrideClick}
                    className="w-full py-4 bg-surface-variant/30 hover:bg-surface-variant/50 text-outline hover:text-primary border border-outline/10 rounded-xl font-label-caps tracking-widest text-[13px] font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">undo</span>
                    Oops! I actually knew it
                  </button>
                )}
              </div>

              <div className="flex items-stretch gap-3 md:gap-4 mt-auto pt-4 w-full">
                <Button3D
                  variant="secondary"
                  onClick={() => {
                    speakText(currentCard.kanji);
                  }}
                  className="w-14 md:w-20 py-0 h-auto shrink-0"
                >
                  <span className="material-symbols-outlined text-[24px]">volume_up</span>
                </Button3D>
                <Button3D onClick={handleNext} variant="primary" className="flex-1 py-6 text-[18px]">
                  Next Card
                  <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </Button3D>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Flashcard;
