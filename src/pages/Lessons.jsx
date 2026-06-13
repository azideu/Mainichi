import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';
import { LESSONS, FUTURE_LESSONS } from '../constants/lessons';
import { sendToAppInventor, APP_INVENTOR_ACTIONS, IS_APP_INVENTOR } from '../utils/appInventorBridge';

const Lessons = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const loadCompletedLessons = async () => {
      // First load from localStorage for instant display
      const saved = localStorage.getItem('mainichi_completed_lessons');
      if (saved) {
        try {
          setCompletedLessons(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse completed lessons", e);
        }
      }

      // Then fetch from server to sync/override
      try {
        const token = localStorage.getItem('mainichi_token');
        if (!token) return;
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
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
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
    const totalProgress = Math.round((completedLessons.length / LESSONS.length) * 100);

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto pb-xl text-left px-2 sm:px-4"
      >

        {/* Global Progress Card */}
        <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-6 mb-10 shadow-paper-layer border border-outline/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-label-caps text-outline tracking-widest text-[10px] mb-1">YOUR TRAINING PROGRESS</h4>
              <h3 className="font-h3 text-on-surface">
                {completedLessons.length === LESSONS.length ? 'Foundations Completed! 🎉' : `${completedLessons.length} of ${LESSONS.length} Modules Mastered`}
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

        {/* Active Foundations Modules */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <h3 className="font-h3 text-on-surface tracking-tight">Active Lessons</h3>
          <div className="h-[1px] flex-1 bg-outline/20"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {LESSONS.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
              return (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  onClick={() => handleLessonStart(lesson)}
                  className="bg-surface rounded-2xl p-6 shadow-paper-layer border border-outline/10 flex flex-col hover:border-primary/20 hover:bg-surface-bright transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 300" }}>{lesson.icon}</span>
                    </div>
                    <span className={`font-label-caps tracking-widest text-[9px] border px-2.5 py-1 rounded-full ${isCompleted ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-secondary/5 border-secondary/20 text-secondary'}`}>
                      {isCompleted ? 'MASTERED' : 'ACTIVE'}
                    </span>
                  </div>

                  <div className="flex-grow relative z-10">
                    <span className="text-[20px] font-bold text-primary tracking-wide block mb-1">{lesson.phrase}</span>
                    <h4 className="font-h3 text-on-surface tracking-tight">{lesson.title}</h4>
                    <p className="font-body-md text-outline tracking-wider font-label-caps text-[9px] mt-0.5">{lesson.romaji} • {lesson.meaning}</p>
                  </div>

                  <div className="mt-8 border-t border-outline/5 pt-4 flex justify-between items-center relative z-10">
                    <span className="font-label-caps text-outline text-[9px] tracking-widest">{lesson.difficulty}</span>
                    <span className="font-label-caps text-primary text-[9px] tracking-widest group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                      {isCompleted ? 'REVIEW' : 'STUDY'} <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Future Expandable Modules */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <h3 className="font-h3 text-outline tracking-tight">Locked Foundations</h3>
          <div className="h-[1px] flex-1 bg-outline/20"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-65">
          {FUTURE_LESSONS.map((lesson) => (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              className="bg-surface-bright rounded-2xl p-6 border border-outline/10 flex flex-col relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-surface border border-outline/20 flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'wght' 200" }}>{lesson.icon}</span>
                </div>
                <span className="font-label-caps tracking-widest text-[9px] border border-outline/20 bg-surface/50 text-outline px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[11px]">lock</span> LOCKED
                </span>
              </div>

              <div className="flex-grow">
                <span className="text-[20px] font-bold text-outline/65 tracking-wide block mb-1">{lesson.phrase}</span>
                <h4 className="font-h3 text-outline tracking-tight">{lesson.title}</h4>
                <p className="font-body-md text-outline/60 tracking-wider font-label-caps text-[9px] mt-0.5">{lesson.romaji} • {lesson.meaning}</p>
              </div>

              <div className="mt-8 border-t border-outline/5 pt-4 flex justify-between items-center">
                <span className="font-label-caps text-outline text-[9px] tracking-widest">{lesson.difficulty}</span>
                <span className="font-label-caps text-outline text-[9px] tracking-widest font-bold">PREMIUM LOCK</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Active Interactive Lesson Slide Player
  const isQuizSlide = currentSlide === activeLesson.slides.length;
  const slide = activeLesson.slides[currentSlide];

  return (
    <div className="max-w-2xl mx-auto pb-xl text-left">
      {/* Lesson Header Navigation */}
      <div className="flex justify-between items-center mb-6">
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
      <div className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
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
              <div className="bg-primary/5 rounded-2xl p-8 mb-6 text-center border border-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-washi opacity-20 mix-blend-multiply pointer-events-none"></div>
                <div className="text-[38px] font-bold text-primary tracking-wide mb-1.5">{slide.japaneseContent}</div>
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
              <div className="flex items-center gap-3 mb-6 bg-secondary/5 border border-secondary/10 px-4 py-3.5 rounded-xl">
                <span className="material-symbols-outlined text-secondary text-[24px]">quiz</span>
                <div>
                  <h4 className="font-label-caps text-secondary tracking-widest text-[9px] font-bold">COMPREHENSION CHECK</h4>
                  <h3 className="font-body-md font-bold text-on-surface">Test Your Knowledge</h3>
                </div>
              </div>

              <h3 className="font-body-lg font-bold text-on-surface leading-relaxed mb-6">
                {activeLesson.quiz.question}
              </h3>

              {/* Quiz Option Buttons */}
              <div className="space-y-3.5">
                {activeLesson.quiz.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrectIndex = index === activeLesson.quiz.correctAnswerIndex;
                  const hasAnswered = selectedOption !== null;

                  let buttonStyle = "w-full text-left p-4 rounded-xl border font-body-md transition-all duration-200 flex items-center justify-between outline-none ";

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
                    className="bg-primary/5 border border-primary/10 p-5 rounded-2xl mt-6 text-left"
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
