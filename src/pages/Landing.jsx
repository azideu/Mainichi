import React, { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg';

// ─── Static washi-paper grid: precise horizontal lines as decoration ──────────
const WashiLines = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
    {/* Three ultra-thin horizontal rules, progressively lower opacity */}
    {[28, 52, 76].map((pct, i) => (
      <div
        key={i}
        className="absolute left-0 right-0"
        style={{
          top: `${pct}%`,
          height: '1px',
          background: `rgba(86, 125, 70, ${0.055 - i * 0.012})`,
        }}
      />
    ))}
    {/* One vertical accent line, left-side */}
    <div
      className="absolute top-0 bottom-0 hidden lg:block"
      style={{
        left: '50%',
        width: '1px',
        background: 'rgba(86, 125, 70, 0.04)',
      }}
    />
  </div>
);

// ─── Feature data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    kanji: '学',
    label: 'Serene Daily Lessons',
    sub: 'Kanji, vocabulary, and grammar — without scoreboards or timers.',
  },
  {
    num: '02',
    kanji: 'あ',
    label: 'Kana Mastery Sheets',
    sub: 'Interactive grids and stroke animations for Hiragana & Katakana.',
  },
  {
    num: '03',
    kanji: '復',
    label: 'Spaced Repetition',
    sub: 'Flashcards timed to the exact moment before forgetting.',
  },
  {
    num: '04',
    kanji: '和',
    label: 'Quiet Community',
    sub: 'Share progress and ask questions — no social media noise.',
  },
];

// ─── Landing page ─────────────────────────────────────────────────────────────
const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const originalClassName = document.body.className;
    document.body.classList.remove('pb-[100px]');
    return () => { document.body.className = originalClassName; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-on-background relative flex flex-col select-none justify-between">
      
      {/* Background: subtle washi paper noise (from global body::before) + horizontal rules */}
      <WashiLines />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 lg:px-10 py-5 lg:py-4 flex justify-center items-center shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={logo} alt="Mainichi" className="h-16 lg:h-20 w-auto opacity-90 hover:opacity-100 transition-opacity" />
        </motion.div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col justify-center items-center lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center relative z-20 max-w-7xl mx-auto px-6 lg:px-10 py-8 lg:py-4 w-full">

        {/* ── LEFT: Hero ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 w-full overflow-hidden">

          {/* Anchored ghost kanji — structural, not decorative */}
          <div
            className="absolute -right-4 lg:-right-10 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: 'clamp(180px, 24vw, 320px)',
              fontWeight: 700,
              color: 'rgba(86, 125, 70, 0.04)',
              lineHeight: 1,
            }}
            aria-hidden="true"
          >
            毎
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 w-full flex flex-col items-center lg:items-start gap-6 lg:gap-7"
          >
            {/* Editorial eyebrow: dash + label */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="block w-7 h-px bg-primary/40 shrink-0" />
              <span
                className="text-primary/55 tracking-[0.22em] uppercase"
                style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: '10px', fontWeight: 400 }}
              >
                毎日の学習
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05 }}
              className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.5rem] text-on-background"
            >
              A quiet space<br />
              for{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 500, color: '#3e5430' }}>daily Japanese.</em>
            </motion.h1>

            {/* Japanese sub-label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-3"
            >
              <span
                style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300, fontSize: '12px', letterSpacing: '0.18em', color: '#8a9185' }}
              >
                毎日、一歩ずつ
              </span>
              <span className="block w-5 h-px bg-outline/25 shrink-0" />
              <span
                style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#8a9185', fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300 }}
                className="uppercase"
              >
                Everyday, one step at a time
              </span>
            </motion.div>

            {/* Prose */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '17px', lineHeight: 1.8, letterSpacing: '0.01em' }}
              className="text-on-surface-variant max-w-xs lg:max-w-sm"
            >
              Step away from the noise. Learn Hiragana, Katakana, and Kanji through a calm, spaced-repetition sanctuary built around a peaceful daily ritual.
            </motion.p>

            {/* CTA — ink-stroke underline style */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <button
                id="cta-begin-journey"
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 py-2.5 border-b border-primary/25 hover:border-primary/70 transition-colors duration-300"
              >
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '14px', letterSpacing: '0.12em' }}
                  className="text-on-background group-hover:text-primary transition-colors duration-300 uppercase"
                >
                  Begin your journey
                </span>
                <span
                  className="text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                  style={{ fontSize: '16px' }}
                >
                  →
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: Editorial Feature Index ─────────────────────────────── */}
        <div className="lg:col-span-7 w-full relative z-10 mt-14 lg:mt-0 flex flex-col justify-center">
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="w-full"
            aria-label="Features"
          >
            {/* Section eyebrow */}
            <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">
              <span className="block w-5 h-px bg-outline/40 shrink-0" />
              <span
                className="text-outline/70 tracking-[0.22em] uppercase"
                style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: '10px', fontWeight: 400 }}
              >
                What's inside
              </span>
            </div>

            {/* Numbered editorial list */}
            <div className="flex flex-col divide-y divide-outline/10">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.num}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
                  className="group flex items-start gap-5 lg:gap-6 py-4 lg:py-5 cursor-default"
                >
                  {/* Large numeral */}
                  <span
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '12px', letterSpacing: '0.1em', color: '#a3a99e', minWidth: '22px' }}
                    className="pt-0.5 shrink-0 select-none"
                  >
                    {f.num}
                  </span>

                  {/* Kanji glyph */}
                  <span
                    style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 700, fontSize: '28px', color: 'rgba(86,125,70,0.18)', lineHeight: 1, minWidth: '34px' }}
                    className="shrink-0 group-hover:text-primary/25 transition-colors duration-300 select-none"
                    aria-hidden="true"
                  >
                    {f.kanji}
                  </span>

                  {/* Text */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '18px', letterSpacing: '-0.01em', color: 'inherit', lineHeight: 1.2 }}
                      className="text-on-background group-hover:text-primary transition-colors duration-300"
                    >
                      {f.label}
                    </span>
                    <span
                      style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300, fontSize: '12px', letterSpacing: '0.01em', lineHeight: 1.6 }}
                      className="text-on-surface-variant"
                    >
                      {f.sub}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="relative z-30 mt-auto border-t border-outline/10 py-5 lg:py-4 px-6 lg:px-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p
            style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300, fontSize: '10px', letterSpacing: '0.16em', color: '#a3a99e' }}
            className="uppercase"
          >
            © {new Date().getFullYear()} Mainichi. All rights reserved.
          </p>
          <div
            className="flex items-center gap-2.5"
            style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300, fontSize: '12px', color: '#8a9185', letterSpacing: '0.08em' }}
          >
            <span>継続は力なり</span>
            <span style={{ color: '#c5c9c0' }}>—</span>
            <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#a3a99e' }} className="uppercase">Continuity is power</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
