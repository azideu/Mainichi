import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';
import { LESSONS, FUTURE_LESSONS } from '../constants/lessons';
import { sendToAppInventor, APP_INVENTOR_ACTIONS, IS_APP_INVENTOR } from '../utils/appInventorBridge';
import LoadingState from '../components/LoadingState';

const CATEGORIES = [
  { id: 'all', title: 'All Modules', icon: 'subject' },
  { id: 'basics', title: 'Basics & Essentials', icon: 'school' },
  { id: 'dining', title: 'Dining Out', icon: 'restaurant' },
  { id: 'travel', title: 'Travel & Transit', icon: 'train' },
  { id: 'shopping', title: 'Shopping', icon: 'shopping_bag' }
];

const Lessons = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const containerRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const updateIndicator = () => {
      const activeButton = containerRef.current.querySelector('[data-active="true"]');
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          top: activeButton.offsetTop,
          height: activeButton.offsetHeight,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    const timer = setTimeout(updateIndicator, 100);

    window.addEventListener('resize', updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [selectedCategory, isLoading]);

  useEffect(() => {
    const loadCompletedLessons = async () => {
      // First load from localStorage for instant display
      const saved = localStorage.getItem('mainichi_completed_lessons');
      if (saved) {
        try {
          setCompletedLessons(JSON.parse(saved));
          setIsLoading(false);
        } catch (e) {
          console.error("Failed to parse completed lessons", e);
        }
      }

      // Then fetch from server to sync/override
      try {
        const token = localStorage.getItem('mainichi_token');
        if (!token) {
          setIsLoading(false);
          return;
        }
        const res = await fetch('/api/lessons/completed', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setCompletedLessons(data);
          localStorage.setItem('mainichi_completed_lessons', JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to fetch completed lessons from backend", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletedLessons();
  }, []);

  const syncLessonCompletion = async (lessonId) => {
    try {
      const token = localStorage.getItem('mainichi_token');
      await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
    } catch (err) {
      console.error("Failed to sync lesson completion with backend", err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { type: "tween", duration: 0.25, ease: "easeOut" } }
  };

  const handleLessonStart = (lesson) => {
    setActiveLesson(lesson);
    setCurrentSlide(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setCelebrate(false);
  };

  const handleNext = () => {
    if (currentSlide < activeLesson.slides.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleAnswerSelect = (index) => {
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === activeLesson.quiz.correctAnswerIndex) {
      // Completed successfully
      const updated = [...completedLessons];
      if (!updated.includes(activeLesson.id)) {
        updated.push(activeLesson.id);
        localStorage.setItem('mainichi_completed_lessons', JSON.stringify(updated));
        setCompletedLessons(updated);
        // Sync with backend
        syncLessonCompletion(activeLesson.id);
      }
      setCelebrate(true);
      if (IS_APP_INVENTOR) {
        sendToAppInventor("PLAY_MEDIA", { file: "correct.mp3" });
      }
    } else {
      // Vibrate only on incorrect choices
      if (IS_APP_INVENTOR) {
        sendToAppInventor(APP_INVENTOR_ACTIONS.VIBRATE, { duration: 200 });
      }
    }
  };

  const handleExitLesson = () => {
    setActiveLesson(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setCelebrate(false);
  };

  // Main Dashboard View
  if (!activeLesson) {
    if (isLoading) {
      return <LoadingState message="Loading modules..." />;
    }
    const totalProgress = Math.round((completedLessons.length / LESSONS.length) * 100);
    const filteredLessons = LESSONS.filter(lesson => selectedCategory === 'all' || lesson.category === selectedCategory);
    const filteredFutureLessons = FUTURE_LESSONS.filter(lesson => selectedCategory === 'all' || lesson.category === selectedCategory);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto pb-6 md:pb-xl text-left px-2 sm:px-4"
      >

        {/* Global Progress Card */}
        <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-4 md:p-6 mb-4 md:mb-10 shadow-paper-layer border border-outline/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-label-caps text-outline tracking-widest text-[10px] mb-1">YOUR TRAINING PROGRESS</h4>
              <h3 className="font-h3 text-on-surface flex items-center">
                {completedLessons.length === LESSONS.length ? (
                  <span className="flex items-center gap-1.5">
                    Foundations Completed!
                    <motion.svg
                      className="w-6 h-6 inline-block align-middle origin-bottom-left"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ 
                        rotate: [0, 15, -10, 15, 0],
                        scale: [1, 1.15, 0.95, 1.1, 1]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2.5, 
                        ease: "easeInOut" 
                      }}
                    >
                      <defs>
                        <linearGradient id="popperGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#E88122" />
                          <stop offset="100%" stopColor="#FFC425" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M2 22C2.7 20 6 15 8 14C10 13 11 14 11 14L8 17C8 17 7 18 5 20C3.5 21.5 2 22 2 22Z" 
                        fill="url(#popperGrad)" 
                        stroke="#E88122" 
                        strokeWidth="1.5" 
                        strokeLinejoin="round" 
                      />
                      <path d="M10 12C12 9 14 10 16 7" stroke="#3A62C4" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 14C15 12 16 13 18 10" stroke="#9CDD54" strokeWidth="2" strokeLinecap="round" />
                      <path d="M7 11C9 8 8 6 11 4" stroke="#F54291" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="18" cy="4" r="1.5" fill="#FFC425" />
                      <circle cx="21" cy="7" r="1" fill="#3A62C4" />
                      <circle cx="14" cy="3" r="2" fill="#9CDD54" />
                      <circle cx="19" cy="11" r="1.2" fill="#F54291" />
                      <polygon points="15,7 16,9 18,9 16.5,10 17,12 15,11 13,12 13.5,10 12,9 14,9" fill="#FFC425" />
                    </motion.svg>
                  </span>
                ) : (
                  `${completedLessons.length} of ${LESSONS.length} Modules Mastered`
                )}
              </h3>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-1/3">
              <div className="w-full h-2.5 bg-surface-variant rounded-full overflow-hidden border border-outline/5">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <span className="font-label-caps tracking-widest text-primary text-xs font-bold shrink-0">{totalProgress}%</span>
            </div>
          </div>
        </motion.div>

        {/* Category Tabs Selector */}
        <motion.div 
          variants={itemVariants} 
          className="flex gap-2 overflow-x-auto pb-2 mb-4 md:mb-8 -mx-4 px-4 scrollbar-none relative"
          ref={containerRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Custom absolute active tab indicator to avoid stretch distortion on long transitions */}
          <motion.div
            className="absolute bg-primary rounded-xl shadow-md border border-primary/20 pointer-events-none"
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              top: indicatorStyle.top,
              height: indicatorStyle.height,
              opacity: indicatorStyle.opacity
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          />

          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-active={isActive}
                onClick={() => setSelectedCategory(cat.id)}
                className="relative py-2.5 px-4 rounded-xl font-label-caps text-[10px] tracking-wider font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap active:scale-[0.97] shrink-0 z-10"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={`material-symbols-outlined text-[15px] relative z-10 transition-colors duration-300 ${isActive ? 'text-on-primary' : 'text-outline'}`}>{cat.icon}</span>
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-on-primary' : 'text-outline'}`}>
                  {cat.title}
                </span>
                {!isActive && (
                  <div className="absolute inset-0 border border-outline/10 bg-surface/40 hover:bg-surface-bright/80 rounded-xl transition-all duration-300 pointer-events-none -z-10" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Active Foundations Modules */}
        {filteredLessons.length > 0 && (
          <div className="mb-6 md:mb-12">
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4 md:mb-6">
              <h3 className="font-h3 text-on-surface tracking-tight">Active Lessons</h3>
              <div className="divider-h flex-1"></div>
            </motion.div>

            <motion.div 
              key={`active-${selectedCategory}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            >
              {[...filteredLessons].sort((a, b) => {
                const aCompleted = completedLessons.includes(a.id);
                const bCompleted = completedLessons.includes(b.id);
                if (aCompleted && !bCompleted) return 1;
                if (!aCompleted && bCompleted) return -1;
                return 0;
              }).map((lesson) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <motion.div
                    key={lesson.id}
                    variants={itemVariants}
                    onClick={() => handleLessonStart(lesson)}
                    className="card-premium-interactive flex flex-col group min-h-[220px]"
                  >
                    <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none rounded-xl"></div>

                    {/* Top Row: Eyebrow + Pill */}
                    <div className="flex justify-between items-center mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="block w-4 h-px bg-primary/45 shrink-0" />
                        <span className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-sans">
                          {isCompleted ? 'Mastered' : 'Active Module'}
                        </span>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 border rounded-full font-serif italic font-medium ${isCompleted ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-secondary/5 border-secondary/20 text-secondary'}`}>
                        {lesson.unit}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow relative z-10 text-left mb-4">
                      <h4 className="font-h2 text-on-surface mb-0.5 font-normal card-title">{lesson.title}</h4>
                      <p className="text-[10px] text-primary/70 font-semibold mb-2 font-sans">
                        {lesson.phrase} ({lesson.meaning})
                      </p>
                      <p className="font-body-lg text-on-surface-variant/80 text-[11px] leading-relaxed line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    {/* Bottom Row */}
                    <div className="mt-auto border-t border-outline/5 pt-4 flex justify-between items-center relative z-10">
                      <span className="font-label-caps text-outline text-[9px] tracking-widest">{lesson.difficulty}</span>
                      <span className="text-[11px] tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5 font-serif italic font-medium">
                        {isCompleted ? 'Review' : 'Study'} <span className="text-[12px] font-sans card-arrow">→</span>
                      </span>
                    </div>
                  </motion.div>
                  );
                })}
            </motion.div>
          </div>
        )}

        {/* Future Expandable Modules */}
        {filteredFutureLessons.length > 0 && (
          <div>
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-4 md:mb-6">
              <h3 className="font-h3 text-outline tracking-tight">Locked Foundations</h3>
              <div className="divider-h flex-1"></div>
            </motion.div>

            <motion.div 
              key={`locked-${selectedCategory}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              {filteredFutureLessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  className="card-premium bg-surface-bright flex flex-col min-h-[220px]"
                >
                  <div className="absolute inset-0 bg-washi opacity-10 pointer-events-none rounded-xl"></div>

                  {/* Top Row: Eyebrow + Pill */}
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="block w-4 h-px bg-outline/25 shrink-0" />
                      <span className="text-outline/70 tracking-[0.2em] uppercase text-[9px] font-sans">
                        Locked Module
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 border border-outline/10 rounded-full bg-surface-variant/30 text-outline/70 font-serif italic font-medium">
                      {lesson.unit}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow relative z-10 text-left mb-4">
                    <h4 className="font-h2 text-outline/70 mb-0.5 font-normal">{lesson.title}</h4>
                    <p className="text-[10px] text-outline/50 font-semibold mb-2 font-sans">
                      {lesson.phrase} ({lesson.meaning})
                    </p>
                    <p className="font-body-lg text-outline/60 text-[11px] leading-relaxed line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-auto border-t border-outline/5 pt-4 flex justify-between items-center relative z-10">
                    <span className="font-label-caps text-outline/50 text-[9px] tracking-widest">{lesson.difficulty}</span>
                    <span className="font-serif italic font-medium text-outline/50 text-[11px] tracking-wider flex items-center gap-1.5">
                      Locked <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'wght' 300" }}>lock</span>
                    </span>
                  </div>
                </motion.div>
                ))}
            </motion.div>
          </div>
        )}

        {/* Empty State when no lessons found in category */}
        {filteredLessons.length === 0 && filteredFutureLessons.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center text-outline"
          >
            <span className="material-symbols-outlined text-[48px] mb-4 opacity-40">find_in_page</span>
            <p className="font-body-lg">No lessons available in this category yet.</p>
          </motion.div>
        )}

      </motion.div>
    );
  }

  // Active Interactive Lesson Slide Player
  const isQuizSlide = currentSlide === activeLesson.slides.length;
  const slide = activeLesson.slides[currentSlide];

  return (
    <div className="max-w-2xl mx-auto pb-6 md:pb-xl text-left">
      {/* Lesson Header Navigation */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <button
          onClick={handleExitLesson}
          className="flex items-center gap-2 py-2 text-outline hover:text-primary transition-colors font-label-caps tracking-widest text-[10px]"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> EXIT LESSON
        </button>
        <span className="font-label-caps text-outline tracking-widest text-[10px]">
          {isQuizSlide ? 'QUIZ TIME' : `SLIDE ${currentSlide + 1} OF ${activeLesson.slides.length}`}
        </span>
      </div>

      {/* Interactive Screen Container */}
      <div className="bg-surface rounded-2xl p-4 md:p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {!isQuizSlide ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="relative z-10"
            >
              {/* Calligraphy Callout Display */}
              <div className="bg-primary/5 rounded-2xl p-4 md:p-8 mb-4 md:mb-6 text-center border border-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                <div className="text-[28px] md:text-[38px] font-bold text-primary tracking-wide mb-1.5">{slide.japaneseContent}</div>
                <div className="text-[13px] text-outline tracking-wider font-label-caps font-bold">{slide.romaji}</div>
              </div>

              <h3 className="font-h3 text-on-surface mb-3 tracking-tight">{slide.title}</h3>
              <p className="font-body-lg text-on-surface-variant leading-relaxed mb-6">{slide.content}</p>

              {/* Progress dots inside slide player */}
              <div className="flex items-center justify-center gap-2.5 mt-8">
                {activeLesson.slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-surface-variant'}`}
                  />
                ))}
                <div className="w-2 h-2 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] text-outline opacity-40">extension</span>
                </div>
              </div>

              {/* Bottom Nav Action Buttons */}
              <div className="flex gap-4 mt-8 pt-4 border-t border-outline/5">
                {currentSlide > 0 ? (
                  <Button3D variant="secondary" onClick={handlePrev} className="flex-1">
                    Back
                  </Button3D>
                ) : null}
                <Button3D variant="primary" onClick={handleNext} className="flex-grow">
                  {currentSlide === activeLesson.slides.length - 1 ? 'Go to Quiz' : 'Continue'}
                </Button3D>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              {/* Calligraphy Header */}
              <div className="flex items-center gap-3 mb-4 md:mb-6 bg-secondary/5 border border-secondary/10 px-4 py-3 md:py-3.5 rounded-xl">
                <span className="material-symbols-outlined text-secondary text-[20px] md:text-[24px]">quiz</span>
                <div>
                  <h4 className="font-label-caps text-secondary tracking-widest text-[9px] font-bold">COMPREHENSION CHECK</h4>
                  <h3 className="font-h3 text-on-surface">Test Your Knowledge</h3>
                </div>
              </div>

              <h3 className="font-h3 text-on-surface leading-relaxed mb-4 md:mb-6">
                {activeLesson.quiz.question}
              </h3>

              {/* Quiz Option Buttons */}
              <div className="space-y-2.5 md:space-y-3.5">
                {activeLesson.quiz.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrectIndex = index === activeLesson.quiz.correctAnswerIndex;
                  const hasAnswered = selectedOption !== null;

                  let buttonStyle = "w-full text-left p-3 md:p-4 rounded-xl border font-body-md transition-all duration-200 flex items-center justify-between outline-none ";

                  if (!hasAnswered) {
                    buttonStyle += "bg-surface hover:bg-surface-bright hover:border-primary/30 border-outline/10 text-on-surface-variant active:scale-[0.99]";
                  } else {
                    if (isCorrectIndex) {
                      buttonStyle += "bg-primary/10 border-primary text-primary font-bold shadow-sm";
                    } else if (isSelected) {
                      buttonStyle += "bg-error/10 border-error text-error font-bold shadow-sm animate-shake";
                    } else {
                      buttonStyle += "bg-surface-variant/20 border-outline/5 text-outline opacity-60";
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={hasAnswered}
                      onClick={() => handleAnswerSelect(index)}
                      className={buttonStyle}
                    >
                      <span>{option}</span>
                      {hasAnswered && isCorrectIndex && (
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      )}
                      {hasAnswered && isSelected && !isCorrectIndex && (
                        <span className="material-symbols-outlined text-error text-[20px]">cancel</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 border border-primary/10 p-3.5 md:p-5 rounded-2xl mt-6 text-left"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
                      <span className="font-label-caps text-primary tracking-widest text-[9px] font-bold">EXPLANATION</span>
                    </div>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">
                      {activeLesson.quiz.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exit or Repeat buttons */}
              <div className="flex gap-4 mt-8 pt-4 border-t border-outline/5">
                <Button3D variant="secondary" onClick={handlePrev} className="flex-1" disabled={celebrate}>
                  Review Slides
                </Button3D>
                {celebrate && (
                  <Button3D variant="primary" onClick={handleExitLesson} className="flex-grow">
                    Complete Lesson
                  </Button3D>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Lessons;
