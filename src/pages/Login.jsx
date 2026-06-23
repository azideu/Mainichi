import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button3D from '../components/Button3D';

import logo from '../assets/logo.svg';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    setError('');
    try {
      const success = await continueAsGuest();
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Failed to start guest session.");
      }
    } catch (err) {
      setError("An error occurred during guest login.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let success = false;
    try {
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(name, email, password);
      }
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-md bg-surface relative overflow-hidden">
      {/* Background Grid & Editorial Guidelines */}
      <div className="absolute inset-0 bg-washi opacity-35 mix-blend-multiply pointer-events-none z-0"></div>
      
      {/* Layer 1 — Fine dot grid (genkouyoushi manuscript texture) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(86,125,70,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      
      {/* Layer 2 — Subtle thin horizontal and vertical rules for editorial rhythm */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-0 right-0 top-[35%]" style={{ height: '1px', background: 'rgba(86, 125, 70, 0.04)' }} />
        <div className="absolute left-0 right-0 top-[65%]" style={{ height: '1px', background: 'rgba(86, 125, 70, 0.03)' }} />
        <div className="absolute top-0 bottom-0 left-[25%] hidden lg:block" style={{ width: '1px', background: 'rgba(86, 125, 70, 0.03)' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-sm bg-surface-bright/95 p-6 sm:p-8 rounded-2xl border border-outline/15 shadow-sm relative z-10"
      >
        <div className="absolute inset-0 bg-washi opacity-25 mix-blend-multiply pointer-events-none rounded-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mb-5 flex justify-center">
            <img src={logo} alt="Mainichi Logo" className="h-16 w-auto opacity-95" />
          </div>
          <h2
            className="font-h2 text-2xl text-on-background mt-2"
          >
            {isLogin ? 'Resume your quiet study' : 'Begin your journey'}
          </h2>
          <p
            className="text-[9px] text-primary/60 tracking-[0.18em] uppercase mt-1.5"
          >
            {isLogin ? '静かな学習の継続' : '新しい旅の始まり'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20 relative z-10">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>error</span>
            <p className="font-body-md text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {!isLogin && (
            <div className="relative z-10">
              <label className="block font-label-caps tracking-widest text-outline/75 text-[9px] mb-1">NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-1 py-2 text-sm bg-transparent border-b border-outline/20 focus:border-primary outline-none transition-colors"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div className="relative z-10">
            <label className="block font-label-caps tracking-widest text-outline/75 text-[9px] mb-1">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-1 py-2 text-sm bg-transparent border-b border-outline/20 focus:border-primary outline-none transition-colors"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="relative z-10">
            <label className="block font-label-caps tracking-widest text-outline/75 text-[9px] mb-1">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-1 py-2 text-sm bg-transparent border-b border-outline/20 focus:border-primary outline-none transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-8 relative z-10">
              <label className="block font-label-caps tracking-widest text-outline/75 text-[9px] mb-1">CONFIRM PASSWORD</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-1 py-2 text-sm bg-transparent border-b border-outline/20 focus:border-primary outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <div className="pt-4 relative z-10">
            <Button3D type="submit" variant="primary" className="w-full">
              {isLogin ? 'Enter Sanctuary' : 'Register'}
            </Button3D>
          </div>
        </form>
        
        <p className="text-center font-body-md text-outline mt-6 text-xs relative z-10">
          {isLogin ? "A new wanderer? " : "Already walking the path? "}
          <span 
            className="text-primary font-medium cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all font-semibold"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>

        <div className="relative flex py-4 items-center z-10">
          <div className="flex-grow border-t border-outline/10"></div>
          <span className="flex-shrink mx-4 text-outline/65 text-[10px] font-label-caps tracking-widest">or</span>
          <div className="flex-grow border-t border-outline/10"></div>
        </div>

        <div className="flex justify-center relative z-10">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="font-body-md text-outline hover:text-primary font-medium cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all text-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">person_outline</span>
            Try as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
