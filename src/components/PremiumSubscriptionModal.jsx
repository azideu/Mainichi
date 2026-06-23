import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import Button3D from './Button3D';

// Import local PNG bank logos
import maybankLogo from '../assets/maybank_logo.png';
import cimbLogo from '../assets/cimb_logo.png';
import rhbLogo from '../assets/rhb_logo.png';

const STEPS = {
  INTRO: 1,
  BANK_SELECT: 2,
  LOGIN: 3,
  TAC: 4,
  SUCCESS: 5
};

const BANKS = {
  MAYBANK: {
    id: 'MAYBANK',
    name: 'Maybank2u',
    color: '#FFCC00', // Yellow
    textColor: '#000000',
    logo: '🐯',
    logoUrl: maybankLogo
  },
  CIMB: {
    id: 'CIMB',
    name: 'CIMB Clicks',
    color: '#DE1C24', // Red
    textColor: '#FFFFFF',
    logo: '🔴',
    logoUrl: cimbLogo
  },
  RHB: {
    id: 'RHB',
    name: 'RHB Now',
    color: '#005EA6', // Blue
    textColor: '#FFFFFF',
    logo: '🔵',
    logoUrl: rhbLogo
  }
};

const PremiumSubscriptionModal = ({ isOpen, onClose }) => {
  const { subscribeUser } = useAuth();
  const { showAlert } = useDialog();
  const [step, setStep] = useState(STEPS.INTRO);
  const [selectedBank, setSelectedBank] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    // Reset state on close
    setStep(STEPS.INTRO);
    setSelectedBank(null);
    setUsername('');
    setPassword('');
    setIsProcessing(false);
    onClose();
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep(STEPS.LOGIN);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(STEPS.TAC);
    }, 1000);
  };

  const handlePaymentApprove = async () => {
    setIsProcessing(true);
    // Simulate payment transaction
    setTimeout(async () => {
      const success = await subscribeUser();
      setIsProcessing(false);
      if (success) {
        setStep(STEPS.SUCCESS);
      } else {
        await showAlert("Transaction failed on the server. Please try again.", "Payment Error");
        handleClose();
      }
    }, 1200);
  };

  const renderContent = () => {
    switch (step) {
      case STEPS.INTRO:
        return (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6"
          >
            <div className="text-center relative z-10 space-y-2 pt-2">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="block w-4 h-px bg-primary/45 shrink-0" />
                <span
                  className="text-primary/75 tracking-[0.2em] uppercase text-[9px] font-bold"
                >
                  Matcha Edition
                </span>
              </div>
              <h2 className="font-h2 text-2xl text-on-surface tracking-tight">
                Mainichi Premium
              </h2>
              <p className="font-body-lg text-outline/80 text-xs">Unlock your absolute learning potential.</p>
              <div className="inline-block border-b border-primary/20 pb-1 font-h3 text-primary text-lg mt-2">
                RM 10.00 <span className="text-xs text-primary/70 italic">/ month</span>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-5 border border-outline/15 shadow-sm relative overflow-hidden text-left">
              <div className="absolute inset-0 bg-washi opacity-20 pointer-events-none rounded-xl" />
              <h4 className="font-label-caps text-outline/80 tracking-wider text-[9px] font-bold mb-3 relative z-10">PREMIUM PERKS</h4>
              <ul className="space-y-3.5 relative z-10">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary text-xs font-bold pt-0.5">✓</span>
                  <span className="text-[11px] text-on-surface-variant/90 leading-relaxed font-light">
                    <strong className="font-medium text-on-surface">Premium Collections</strong>: Access all premium community decks.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary text-xs font-bold pt-0.5">✓</span>
                  <span className="text-[11px] text-on-surface-variant/90 leading-relaxed font-light">
                    <strong className="font-medium text-on-surface">Unlimited Decks</strong>: Create as many custom flashcard decks as you want.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary text-xs font-bold pt-0.5">✓</span>
                  <span className="text-[11px] text-on-surface-variant/90 leading-relaxed font-light">
                    <strong className="font-medium text-on-surface">Capped-Free Study</strong>: Review custom paths without daily limits.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary text-xs font-bold pt-0.5">✓</span>
                  <span className="text-[11px] text-on-surface-variant/90 leading-relaxed font-light">
                    <strong className="font-medium text-on-surface">Advanced Progress</strong>: Full study logs & review calendars.
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-1/3 py-3 bg-surface border border-outline/15 text-outline font-label-caps tracking-widest text-[9px] font-bold rounded-xl hover:bg-surface-bright active:scale-95 transition-all"
              >
                Back
              </button>
              <Button3D
                variant="primary"
                onClick={() => setStep(STEPS.BANK_SELECT)}
                className="flex-1 font-label-caps tracking-widest text-[9px] font-bold py-3"
              >
                Get Premium
              </Button3D>
            </div>
          </motion.div>
        );

      case STEPS.BANK_SELECT:
        return (
          <motion.div
            key="bank_select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-label-caps tracking-widest rounded-full">
                BANKING PORTAL SIMULATOR
              </span>
              <h2 className="font-h2 text-on-surface tracking-tight">FPX Bank Portal</h2>
              <p className="font-body-md text-outline">Select your simulated banking gateway to proceed.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {Object.values(BANKS).map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className="p-5 bg-surface border border-outline/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-primary/30 transition-all hover:bg-surface-bright active:scale-[0.98] group text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-washi opacity-10 mix-blend-multiply pointer-events-none"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner overflow-hidden p-1.5 bg-white border border-outline/10"
                    >
                      {bank.logoUrl ? (
                        <img src={bank.logoUrl} alt={bank.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-h2 text-xl">{bank.logo}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-h3 text-on-surface group-hover:text-primary transition-colors">{bank.name}</h4>
                      <p className="font-body-sm text-outline">Simulated Payment Link</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">chevron_right</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(STEPS.INTRO)}
              className="w-full py-4 text-outline font-label-caps tracking-widest text-xs text-center hover:text-primary transition-colors"
            >
              Cancel Payment
            </button>
          </motion.div>
        );

      case STEPS.LOGIN:
        return (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div 
                className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-full font-h3 text-sm shadow-sm border border-outline/10 bg-white text-on-surface"
              >
                <div className="w-6 h-6 flex items-center justify-center overflow-hidden rounded-full bg-white p-0.5 border border-outline/10">
                  {selectedBank.logoUrl ? (
                    <img src={selectedBank.logoUrl} alt={selectedBank.name} className="w-full h-full object-contain" />
                  ) : (
                    <span>{selectedBank.logo}</span>
                  )}
                </div>
                <span className="font-semibold">{selectedBank.name}</span>
              </div>
              <h2 className="font-h2 text-on-surface tracking-tight mt-2">Secure FPX Login</h2>
              <p className="font-body-md text-amber-500 font-medium">✨ Demo Portal: Type anything to log in!</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block font-label-caps text-[10px] tracking-widest text-outline">USERNAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mainichi_user"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 rounded-xl border border-outline/15 bg-surface text-on-surface focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-label-caps text-[10px] tracking-widest text-outline">PASSWORD</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-xl border border-outline/15 bg-surface text-on-surface focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(STEPS.BANK_SELECT)}
                  className="w-1/3 py-4 bg-surface border border-outline/10 text-outline font-label-caps tracking-widest text-xs rounded-xl hover:bg-surface-bright active:scale-95 transition-all"
                >
                  Change Bank
                </button>
                <Button3D
                  variant="primary"
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 font-label-caps tracking-widest text-xs"
                >
                  {isProcessing ? 'Connecting...' : 'Secure Sign In'}
                </Button3D>
              </div>
            </form>
          </motion.div>
        );

      case STEPS.TAC:
        return (
          <motion.div
            key="tac"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-label-caps tracking-widest rounded-full">
                BANKING PORTAL SIMULATOR
              </span>
              <h2 className="font-h2 text-on-surface tracking-tight">Authorize Payment</h2>
              <p className="font-body-md text-outline">Confirm details to authorize your simulated subscription.</p>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-outline/10 space-y-4 shadow-sm relative overflow-hidden text-left">
              <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
              <div className="relative z-10 grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <span className="font-label-caps text-outline text-[10px] tracking-widest">MERCHANT</span>
                <span className="font-body-md text-on-surface font-semibold text-right">Mainichi Learning (Sim)</span>

                <span className="font-label-caps text-outline text-[10px] tracking-widest">AMOUNT</span>
                <span className="font-body-md text-primary font-bold text-right text-base">RM 10.00</span>

                <span className="font-label-caps text-outline text-[10px] tracking-widest">REFERENCE</span>
                <span className="font-body-md text-on-surface-variant font-mono text-[11px] text-right">MNCH-FPX-52901</span>

                <span className="font-label-caps text-outline text-[10px] tracking-widest">SOURCE DEBIT</span>
                <span className="font-body-md text-on-surface-variant text-right flex items-center justify-end gap-1.5">
                  <div className="w-5 h-5 flex items-center justify-center overflow-hidden rounded bg-white p-0.5 border border-outline/5">
                    {selectedBank.logoUrl ? (
                      <img src={selectedBank.logoUrl} alt={selectedBank.name} className="w-full h-full object-contain" />
                    ) : (
                      <span>{selectedBank.logo}</span>
                    )}
                  </div>
                  <span>{selectedBank.name} (*4019)</span>
                </span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 text-center">
              <p className="font-body-sm text-amber-500 leading-relaxed">
                This is a <strong>sandbox presentation simulation</strong>. Clicking approve will instantly upgrade your account to Premium without actual charges!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(STEPS.LOGIN)}
                disabled={isProcessing}
                className="w-1/3 py-4 bg-surface border border-outline/10 text-outline font-label-caps tracking-widest text-xs rounded-xl hover:bg-surface-bright active:scale-95 transition-all"
              >
                Back
              </button>
              <Button3D
                variant="primary"
                onClick={handlePaymentApprove}
                disabled={isProcessing}
                className="flex-1 font-label-caps tracking-widest text-xs"
              >
                {isProcessing ? 'Processing Payment...' : 'Approve & Pay (RM10)'}
              </Button3D>
            </div>
          </motion.div>
        );

      case STEPS.SUCCESS:
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            {/* Simple confetti celebration */}
            <div className="relative w-24 h-24 mx-auto mb-2 flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[48px] text-primary" style={{ fontVariationSettings: "'wght' 300" }}>done_all</span>
              </motion.div>
              
              {/* Confetti pieces */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, y: 0, x: 0 }}
                    animate={{ scale: [0, 1, 0], y: [-10, -50 - (i * 10), -60], x: [(i - 3) * 15, (i - 3) * 30] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="absolute w-2.5 h-2.5 rounded-full"
                    style={{ 
                      backgroundColor: i % 2 === 0 ? '#4A6B53' : '#E6AD5C',
                      left: '45%',
                      top: '40%'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-h2 text-primary tracking-tight">Purchase Successful!</h2>
              <p className="font-body-lg text-outline">You are now a Mainichi Premium Member.</p>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-left max-w-sm mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
              <div className="relative z-10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-label-caps text-outline text-[9px] tracking-widest">TRANSACTION</span>
                  <span className="font-body-md text-on-surface font-mono">MNCH-TXN-90184</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-caps text-outline text-[9px] tracking-widest">STATUS</span>
                  <span className="font-label-caps text-primary font-bold">PAID</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-label-caps text-outline text-[9px] tracking-widest">TIER UNLOCKED</span>
                  <span className="font-body-md text-on-surface font-semibold">Matcha Premium (Annual)</span>
                </div>
              </div>
            </div>

            <Button3D
              variant="primary"
              onClick={handleClose}
              className="w-full font-label-caps tracking-widest text-xs"
            >
              Enter Premium Realm
            </Button3D>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop glass */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
          className="relative z-10 w-full max-w-sm bg-surface-bright rounded-2xl p-6 border border-outline/15 shadow-sm overflow-hidden"
        >
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 bg-washi opacity-25 mix-blend-multiply pointer-events-none rounded-inherit"></div>

          {/* Close trigger button */}
          {step !== STEPS.SUCCESS && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-outline/60 hover:text-on-surface transition-colors p-1"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}

          <div className="relative z-10">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumSubscriptionModal;
