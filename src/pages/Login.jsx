import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button3D from '../components/Button3D';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match!");
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
    <div className="min-h-screen flex flex-col items-center justify-center p-md bg-surface">
      <div className="w-full max-w-md bg-surface-container-lowest p-xl rounded-xl shadow-ambient shadow-primary/10 border border-surface-variant">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-container rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <h1 className="font-h1 text-primary mb-2">Mainichi</h1>
          <p className="font-body-md text-on-surface-variant">
            {isLogin ? 'Start your Japanese journey.' : 'Create your account today.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-start gap-2 border border-error/20">
            <span className="material-symbols-outlined text-error text-[20px]">error</span>
            <p className="font-body-md text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block font-label-caps text-on-surface-variant mb-2">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none transition-shadow"
                placeholder="Your Name"
                required
              />
            </div>
          )}
          <div>
            <label className="block font-label-caps text-on-surface-variant mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none transition-shadow"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block font-label-caps text-on-surface-variant mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none transition-shadow"
              placeholder="••••••••"
              required
            />
          </div>
          {!isLogin && (
            <div className="mb-8">
              <label className="block font-label-caps text-on-surface-variant mb-2">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-container border-none focus:ring-2 focus:ring-primary outline-none transition-shadow"
                placeholder="••••••••"
                required
              />
            </div>
          )}
          
          <Button3D type="submit" variant="primary">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button3D>
        </form>
        
        <p className="text-center font-body-md text-on-surface-variant mt-6 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="text-primary font-medium cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
