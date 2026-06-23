import React, { useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button3D from '../components/Button3D';
import logo from '../assets/logo.svg';

// Custom Canvas Component for Japanese Zen Ink Waves (Seigaiha style)
const ZenWaves = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = 600;
    };
    window.addEventListener('resize', handleResize);

    // Wave parameters (relative to 600px height decoration)
    const waves = [
      { y: 340, length: 0.002, amplitude: 25, speed: 0.004, phase: 0 },
      { y: 400, length: 0.0015, amplitude: 30, speed: -0.003, phase: 2 },
      { y: 460, length: 0.001, amplitude: 35, speed: 0.002, phase: 4 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw elegant background gradient matching surface color
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(251, 252, 248, 0)');
      gradient.addColorStop(1, 'rgba(251, 252, 248, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x < width; x++) {
          const y = wave.y + Math.sin(x * wave.length + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Zen Green Palette with low opacities
        const colorIndex = index === 0 ? 'rgba(86, 125, 70, 0.04)' : index === 1 ? 'rgba(86, 125, 70, 0.06)' : 'rgba(86, 125, 70, 0.08)';
        ctx.fillStyle = colorIndex;
        ctx.fill();

        // Stroke line to represent hand-drawn ink line
        ctx.strokeStyle = `rgba(86, 125, 70, ${0.12 - index * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        wave.phase += wave.speed;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute bottom-0 left-0 right-0 w-full h-[600px] pointer-events-none z-0" />;
};

const Landing = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Remove body bottom padding to prevent white segment gap on landing
    const originalClassName = document.body.className;
    document.body.classList.remove('pb-[100px]');
    return () => {
      document.body.className = originalClassName;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Floating Kana details
  const floatingKana = [
    { char: 'あ', size: 'text-5xl', top: '20%', left: '10%', delay: 0, duration: 25 },
    { char: 'の', size: 'text-4xl', top: '15%', left: '80%', delay: 2, duration: 30 },
    { char: '和', size: 'text-6xl', top: '55%', left: '5%', delay: 4, duration: 28 },
    { char: '日', size: 'text-5xl', top: '70%', left: '85%', delay: 1, duration: 32 },
    { char: 'み', size: 'text-3xl', top: '40%', left: '90%', delay: 5, duration: 22 },
    { char: '学習', size: 'text-2xl', top: '75%', left: '15%', delay: 3, duration: 35 },
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-on-background relative flex flex-col font-body-md select-none justify-between">
      {/* Serene Atmospheric Background */}
      <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none z-0"></div>
      <ZenWaves />

      {/* Floating Kana Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {floatingKana.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute font-sans font-light text-primary/10 ${item.size} select-none`}
            style={{
              top: item.top,
              left: item.left,
              fontFamily: "'Zen Kaku Gothic New', sans-serif"
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            {item.char}
          </motion.div>
        ))}
      </div>

      {/* Elegant Centered Header */}
      <header className="relative z-30 max-w-7xl mx-auto w-full px-6 py-6 lg:py-4 flex justify-center items-center shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          <img src={logo} alt="Mainichi Logo" className="h-16 lg:h-20 w-auto opacity-95 hover:opacity-100 transition-opacity" />
        </motion.div>
      </header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col justify-center items-center lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center lg:content-center relative z-20 max-w-7xl mx-auto px-6 py-8 sm:py-16 lg:py-4 w-full">

        {/* LEFT COLUMN: HERO SECTION — Ryokan Editorial */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left relative z-10 w-full overflow-hidden">

          {/* Architectural ghost character — structural, anchored, not floating */}
          <div
            className="absolute -right-8 lg:-right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
            style={{
              fontFamily: "'Zen Kaku Gothic New', sans-serif",
              fontSize: 'clamp(200px, 26vw, 340px)',
              fontWeight: 700,
              color: 'rgba(86, 125, 70, 0.045)',
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
            aria-hidden="true"
          >
            毎
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative z-10 w-full flex flex-col items-center lg:items-start gap-6 lg:gap-7"
          >
            {/* Editorial label with dash rule */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center gap-3"
            >
              <span className="block w-8 h-px bg-primary/40 shrink-0"></span>
              <span
                className="text-primary/60 tracking-[0.25em] uppercase"
                style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontSize: '10px', fontWeight: 400 }}
              >
                毎日の学習
              </span>
            </motion.div>

            {/* Main heading — Cormorant Garamond for editorial weight contrast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="space-y-2"
            >
              <h1
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.05 }}
                className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.4rem] text-on-background"
              >
                A quiet space<br />
                for <em style={{ fontStyle: 'italic', fontWeight: 500, color: '#3e5430' }}>daily Japanese.</em>
              </h1>
            </motion.div>

            {/* Japanese sub-label — architectural, not decorative */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-baseline gap-4"
            >
              <span
                style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif", fontWeight: 300, fontSize: '13px', letterSpacing: '0.2em', color: '#74796e' }}
              >
                毎日、一歩ずつ
              </span>
            </motion.div>

            {/* Prose */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '17px', lineHeight: 1.75, letterSpacing: '0.01em' }}
              className="text-on-surface-variant max-w-sm"
            >
              Step away from the noise. Learn Hiragana, Katakana, and Kanji through a calm, spaced-repetition sanctuary built around a peaceful daily ritual.
            </motion.p>

            {/* CTA — minimal, ink-stroke style */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="flex justify-center lg:justify-start"
            >
              <button
                onClick={() => navigate('/login')}
                className="group flex items-center gap-3 pl-0 pr-4 py-3 border-b border-primary/30 hover:border-primary transition-colors duration-300"
              >
                <span
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: '15px', letterSpacing: '0.08em' }}
                  className="text-on-background group-hover:text-primary transition-colors duration-300 tracking-widest uppercase"
                >
                  Begin your journey
                </span>
                <span
                  className="text-primary group-hover:translate-x-1 transition-transform duration-300"
                  style={{ fontSize: '18px' }}
                >
                  →
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: FEATURE GRID */}
        <div className="lg:col-span-7 w-full relative z-10 mt-12 lg:mt-0 flex flex-col justify-center">
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full text-left"
          >
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-on-background font-h2">The Path of Sanctuary</h2>
              <p className="text-xs text-outline mt-1 tracking-wide font-sans">Designed for steady, mindful acquisition.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Feature 1 */}
              <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 lg:p-5 rounded-2xl border border-outline/10 hover:border-primary/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>menu_book</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1 font-h3">Serene Daily Lessons</h3>
                <p className="text-on-surface-variant text-xs font-light leading-relaxed">
                  Study essential Kanji, vocabulary, and grammar with distraction-free interfaces that value your cognitive focus. No scoreboards or timer pressure.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 lg:p-5 rounded-2xl border border-outline/10 hover:border-primary/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                  <span className="text-[15px] font-sans font-medium" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>あ</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1 font-h3">Hiragana & Katakana Sheets</h3>
                <p className="text-on-surface-variant text-xs font-light leading-relaxed">
                  Interact with beautiful Kana grids, stroke animations, and trace exercises to master the fundamentals of reading and writing early on.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 lg:p-5 rounded-2xl border border-outline/10 hover:border-primary/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>style</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1 font-h3">Spaced Repetition (SRS)</h3>
                <p className="text-on-surface-variant text-xs font-light leading-relaxed">
                  Maintain reviews in our flashcard sanctuary. The spaced repetition algorithm targets items right as you're about to forget them, optimizing long-term retention.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-surface-container-lowest/80 backdrop-blur-md p-6 lg:p-5 rounded-2xl border border-outline/10 hover:border-primary/20 hover:shadow-ambient hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'wght' 300" }}>groups</span>
                </div>
                <h3 className="text-base font-bold text-on-surface mb-1 font-h3">Calm Learning Community</h3>
                <p className="text-on-surface-variant text-xs font-light leading-relaxed">
                  Connect and share updates with fellow language travelers in a serene space. Post questions, show progress, and learn together without the noise of typical social networks.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      {/* Zen Footer */}
      <footer className="relative z-30 mt-auto border-t border-outline/10 bg-surface-container-low/30 py-6 lg:py-4 px-6 text-center shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-outline tracking-wider font-label-caps">
            &copy; {new Date().getFullYear()} MAINICHI. ALL RIGHTS RESERVED.
          </p>

          <div className="text-[13px] text-primary/70 font-light italic font-sans flex items-center gap-2" style={{ fontFamily: "'Zen Kaku Gothic New', sans-serif" }}>
            <span>継続は力なり</span>
            <span className="text-outline/40">•</span>
            <span className="not-italic text-outline text-xs">Continuity is power.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
