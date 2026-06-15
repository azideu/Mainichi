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
        navigate('/');
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
        navigate('/');
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-md bg-surface relative overflow-hidden">
      {/* Serene Atmospheric Background */}
      <div className="absolute inset-0 bg-washi opacity-40 mix-blend-multiply pointer-events-none z-0"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed rounded-full blur-3xl opacity-30 z-0"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-fixed rounded-full blur-3xl opacity-20 z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-xl bg-surface-bright/90 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-paper-layer border border-outline/10 relative z-10"
      >
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <img src={logo} alt="Mainichi Logo" className="h-20 w-auto opacity-95 hover:opacity-100 transition-opacity drop-shadow-sm" />
          </div>
          <p className="font-body-md text-outline tracking-wide">
            {isLogin ? 'Resume your quiet study.' : 'Begin your journey.'}
          </p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>error</span>
            <p className="font-body-md text-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block font-label-caps tracking-widest text-outline mb-2 ml-1">NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 text-lg rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-label-caps tracking-widest text-outline mb-2 ml-1">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 text-lg rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block font-label-caps tracking-widest text-outline mb-2 ml-1">PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 text-lg rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-8">
              <label className="block font-label-caps tracking-widest text-outline mb-2 ml-1">CONFIRM PASSWORD</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-4 text-lg rounded-xl bg-surface-variant/50 border border-transparent focus:bg-surface-bright focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <div className="pt-4">
            <Button3D type="submit" variant="primary" className="w-full">
              {isLogin ? 'Enter Sanctuary' : 'Register'}
            </Button3D>
          </div>
        </form>
        
        <p className="text-center font-body-md text-outline mt-8 text-sm">
          {isLogin ? "A new wanderer? " : "Already walking the path? "}
          <span 
            className="text-primary font-medium cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-outline/10"></div>
          <span className="flex-shrink mx-4 text-outline text-xs font-label-caps tracking-widest">or</span>
          <div className="flex-grow border-t border-outline/10"></div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGuestLogin}
            className="font-body-md text-outline hover:text-primary font-medium cursor-pointer hover:underline underline-offset-4 decoration-primary/50 transition-all text-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">person_outline</span>
            Try as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
