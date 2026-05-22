import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button3D from '../components/Button3D';

// Extensible lessons database
const LESSONS = [
  {
    id: 'greetings',
    title: 'Common Greetings',
    japaneseTitle: 'あいさつ',
    phrase: 'こんにちは',
    romaji: 'Konnichiwa',
    meaning: 'Hello / Good afternoon',
    icon: 'chat_bubble',
    difficulty: 'N5 (Beginner)',
    duration: '2 mins',
    slides: [
      {
        title: 'The Versatile Greeting',
        japaneseContent: 'こんにちは',
        romaji: 'Konnichiwa',
        content: '“Konnichiwa” is the most famous and widely used Japanese greeting. It is the go-to phrase for saying "Hello" or "Good afternoon" to friends, coworkers, and strangers alike.'
      },
      {
        title: 'Pronunciation & Spelling',
        japaneseContent: 'こんにち は',
        romaji: 'Konnichi wa',
        content: 'Although it is pronounced "Konnichi-wa", the final character is written as は (ha), not わ (wa). This is because historically, the greeting was short for "Konnichi wa gokigen ikaga desu ka?" (As for today, how are you feeling?). The "は" remains as the topic marker particle!'
      },
      {
        title: 'Time of Day Guidelines',
        japaneseContent: 'おはよう vs こんにちは vs こんばんは',
        romaji: 'Ohayou vs Konnichiwa vs Konbanwa',
        content: 'Use “Konnichiwa” primarily from late morning (around 10:30 AM) until dusk. For early mornings, use “Ohayou” (おはよう - Good morning), and for nighttime, use “Konbanwa” (こんばんは - Good evening).'
      }
    ],
    quiz: {
      question: 'Why is the final character in “こんにちは” written as は (ha) instead of わ (wa)?',
      options: [
        'It is a spelling mistake.',
        'It historically acted as the grammatical topic marker particle "wa".',
        'It is easier to write in Hiragana.',
        'It changes the meaning to goodbye.'
      ],
      correctAnswerIndex: 1,
      explanation: 'Historically, the greeting was short for a longer phrase starting with "Konnichi wa..." (As for today...). The "は" (ha) represents the grammatical topic marker particle, which is pronounced as "wa".'
    }
  },
  {
    id: 'gratitude',
    title: 'Expressing Gratitude',
    japaneseTitle: '感謝',
    phrase: 'ありがとう',
    romaji: 'Arigatou',
    meaning: 'Thank you',
    icon: 'favorite',
    difficulty: 'N5 (Beginner)',
    duration: '2 mins',
    slides: [
      {
        title: 'The Warm Thank You',
        japaneseContent: 'ありがとう',
        romaji: 'Arigatou',
        content: '“Arigatou” is a warm, casual way to express thanks. It is perfect for close friends, family members, or peers.'
      },
      {
        title: 'Politeness Matters',
        japaneseContent: 'ありがとうございます',
        romaji: 'Arigatou gozaimasu',
        content: 'To express gratitude to superiors, teachers, or strangers, append "gozaimasu" to make it "Arigatou gozaimasu". This elevates it to a formal, polite level of respect.'
      },
      {
        title: 'Deep Gratitude Origin',
        japaneseContent: '有り難う',
        romaji: 'Arigatou (Kanji origin)',
        content: 'Historically, "Arigatou" comes from "ari-gatai", which literally means "difficult to exist" or "rare/precious". When someone does a favor, you are saying it is a rare and precious occurrence!'
      }
    ],
    quiz: {
      question: 'What should you append to “ありがとう” to make it formal and polite?',
      options: [
        'です (desu)',
        'ございます (gozaimasu)',
        'ます (masu)',
        'だよ (dayo)'
      ],
      correctAnswerIndex: 1,
      explanation: 'Appending "gozaimasu" makes it "Arigatou gozaimasu", which is the standard polite form of thank you in Japanese.'
    }
  },
  {
    id: 'first_meeting',
    title: 'First Impressions',
    japaneseTitle: '自己紹介',
    phrase: 'はじめまして',
    romaji: 'Hajimemashite',
    meaning: 'Nice to meet you',
    icon: 'sentiment_satisfied',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins',
    slides: [
      {
        title: 'Meeting for the First Time',
        japaneseContent: 'はじめまして',
        romaji: 'Hajimemashite',
        content: '“Hajimemashite” is said when meeting someone for the very first time. It translates to "Nice to meet you" or "How do you do?".'
      },
      {
        title: 'The Beginning of a Journey',
        japaneseContent: '始める',
        romaji: 'Hajimeru (To begin)',
        content: 'The phrase comes from the verb "hajimeru" (始める) meaning "to begin" or "to start". By saying "Hajimemashite", you are literally declaring: "We are beginning our relationship."'
      },
      {
        title: 'Polite Follow-up',
        japaneseContent: 'よろしくおねがいします',
        romaji: 'Yoroshiku onegaishimasu',
        content: 'After introducing yourself, always finish with "Yoroshiku onegaishimasu". This humble phrase translates to "Please favor me" or "Please treat me kindly".'
      }
    ],
    quiz: {
      question: 'What verb does the phrase “はじめまして” stem from?',
      options: [
        'おわる (To end)',
        'はじめる (To begin)',
        'あそぶ (To play)',
        'はなす (To speak)'
      ],
      correctAnswerIndex: 1,
      explanation: '“Hajimemashite” stems from the verb "hajimeru" (始める), meaning "to begin", symbolizing the start of a new connection.'
    }
  }
];

// Locked future lessons
const FUTURE_LESSONS = [
  {
    id: 'directions',
    title: 'Asking for Directions',
    japaneseTitle: '道案内',
    phrase: '〜はどこですか',
    romaji: '... wa doko desu ka?',
    meaning: 'Where is...?',
    icon: 'map',
    difficulty: 'N5 (Beginner)',
    duration: '4 mins'
  },
  {
    id: 'food',
    title: 'Ordering Food',
    japaneseTitle: '注文',
    phrase: '〜をください',
    romaji: '... o kudasai',
    meaning: 'Please give me...',
    icon: 'restaurant',
    difficulty: 'N5 (Beginner)',
    duration: '3 mins'
  }
];

const Lessons = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('mainichi_completed_lessons');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);

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
      }
      setCelebrate(true);
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
        className="max-w-4xl mx-auto pb-xl text-left"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-h1 text-primary mb-2 tracking-tighter">Lessons</h1>
          <p className="font-body-lg text-outline">Master key Japanese phrases and structures step by step.</p>
        </motion.div>

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
          {[...LESSONS]
            .sort((a, b) => {
              const aComp = completedLessons.includes(a.id) ? 1 : 0;
              const bComp = completedLessons.includes(b.id) ? 1 : 0;
              return aComp - bComp;
            })
            .map((lesson) => {
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
                    Complete Lesson 🎉
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
