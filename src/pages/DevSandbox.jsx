import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button3D from '../components/Button3D';
import { useApp } from '../context/AppContext';
import {
  sendToAppInventor,
  speakText,
  saveToTinyDB,
  getFromTinyDB,
  playMedia
} from '../utils/appInventorBridge';

const DevSandbox = () => {
  const navigate = useNavigate();
  const { isMobileApp } = useApp();
  const [speechInput, setSpeechInput] = useState('');
  const [logs, setLogs] = useState([]);

  // Listen to outgoing dispatches from the bridge
  useEffect(() => {
    const handleLog = (e) => {
      setLogs(prev => [e.detail, ...prev].slice(0, 50));
    };
    window.addEventListener('app-bridge-log', handleLog);
    return () => window.removeEventListener('app-bridge-log', handleLog);
  }, []);

  const triggerSpeechMock = () => {
    if (speechInput.trim()) {
      window.dispatchEvent(new CustomEvent('app-speech-result', { detail: speechInput }));
      setSpeechInput('');
    }
  };

  const triggerShakeMock = () => {
    window.dispatchEvent(new CustomEvent('app-shake-event'));
  };

  const triggerOfflineMock = () => {
    window.dispatchEvent(new Event('offline'));
  };

  const triggerOnlineMock = () => {
    window.dispatchEvent(new Event('online'));
  };

  const injectIncomingPayload = (action, data) => {
    window.onAppInventorData?.(JSON.stringify({ action, data, timestamp: Date.now() }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto pb-xl px-2 sm:px-4"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          variants={itemVariants}
          onClick={() => navigate(-1)}
          className="w-11 h-11 flex items-center justify-center bg-surface hover:bg-surface-variant text-outline hover:text-primary rounded-xl border border-outline/10 shadow-sm active:scale-95 transition-all duration-200"
          title="Back"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </motion.button>
        <div>
          <motion.h1 variants={itemVariants} className="font-h1 text-primary tracking-tighter mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px] animate-pulse">biotech</span>
            Sandbox Console
          </motion.h1>
          <motion.p variants={itemVariants} className="font-label-caps text-outline tracking-widest text-[9px]">
            MOBILE WRAPPER SIMULATOR & TESTING PANEL
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Column: Mocks & Inputs */}
        <div className="space-y-6">

          {/* Section 1: Inputs & Sensors */}
          <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            <h3 className="font-h3 text-on-surface mb-4 tracking-tight relative z-10">1. Client-Side Input Mocks</h3>

            <div className="space-y-4 relative z-10">
              {/* Speech simulator */}
              <div className="bg-surface-container-low border border-outline/5 rounded-xl p-3 flex flex-col gap-2">
                <label className="font-body-md text-on-surface-variant">Speech Recognition Output</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type words like: ねこ, いぬ"
                    value={speechInput}
                    onChange={(e) => setSpeechInput(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs rounded-xl bg-surface-variant/40 border border-outline/10 focus:border-primary/50 focus:outline-none text-on-surface font-body-md"
                  />
                  <Button3D onClick={triggerSpeechMock} variant="primary" className="py-2.5 px-4 text-xs font-semibold">
                    Send
                  </Button3D>
                </div>
              </div>

              {/* Shaking & Network Mocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={triggerShakeMock}
                  className="bg-secondary text-on-secondary text-xs font-semibold py-3 rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-1.5 shadow-sm border border-secondary/10"
                >
                  <span className="material-symbols-outlined text-[16px]">vibration</span>
                  Mock Phone Shake
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={triggerOfflineMock}
                    className="bg-error text-on-error text-xs font-semibold py-3 rounded-xl active:scale-95 transition-transform shadow-sm"
                  >
                    Go Offline
                  </button>
                  <button
                    onClick={triggerOnlineMock}
                    className="bg-primary text-on-primary text-xs font-semibold py-3 rounded-xl active:scale-95 transition-transform shadow-sm"
                  >
                    Go Online
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 2: Mobile Action Injections */}
          <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            <h3 className="font-h3 text-on-surface mb-4 tracking-tight relative z-10">2. Incoming Mobile Payloads</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
              <button
                type="button"
                onClick={() => injectIncomingPayload('SPEECH_RESULT', 'ねこ')}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 transition-colors text-center font-semibold"
              >
                Inject Speech ("ねこ")
              </button>
              <button
                type="button"
                onClick={() => injectIncomingPayload('SENSOR_DATA', 'SHAKE')}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 transition-colors text-center font-semibold"
              >
                Inject Shake ("SHAKE")
              </button>
            </div>
          </motion.div>

          {/* Section 3: Outgoing Trigger Tests */}
          <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>
            <h3 className="font-h3 text-on-surface mb-4 tracking-tight relative z-10">3. Outgoing Trigger Tests</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
              <button
                type="button"
                onClick={() => speakText("日本語")}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test SPEAK
              </button>
              <button
                type="button"
                onClick={() => sendToAppInventor("VIBRATE", { duration: 150 })}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test VIBRATE
              </button>
              <button
                type="button"
                onClick={() => playMedia("correct.mp3")}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test PLAY_MEDIA
              </button>
              <button
                type="button"
                onClick={() => saveToTinyDB("test_tag", "test_value")}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test SAVE_TINYDB
              </button>
              <button
                type="button"
                onClick={() => getFromTinyDB("test_tag")}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test GET_TINYDB
              </button>
              <button
                type="button"
                onClick={() => sendToAppInventor("SET_REMINDER", { enabled: true, time: "12:34" })}
                className="border border-outline/10 text-on-surface text-[11px] py-2.5 rounded-xl hover:bg-surface-variant/40 active:scale-95 transition-all text-center font-semibold"
              >
                Test SET_REMINDER
              </button>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Outgoing Logs Stream */}
        <div className="flex flex-col h-full">
          <motion.div variants={itemVariants} className="bg-surface rounded-2xl p-lg shadow-paper-layer border border-outline/10 flex-1 relative overflow-hidden flex flex-col min-h-[400px]">
            <div className="absolute inset-0 bg-washi opacity-30 mix-blend-multiply pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="font-h3 text-on-surface tracking-tight">4. Outgoing Bridge Log</h3>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-[9px] text-primary hover:underline font-label-caps tracking-widest"
              >
                CLEAR LOGS
              </button>
            </div>

            <div className="flex-1 bg-on-surface/5 rounded-2xl p-4 font-mono text-[11px] overflow-y-auto flex flex-col gap-3 border border-outline/10 text-left relative z-10 h-[480px]">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center px-4">
                  <span className="text-outline/60 italic text-[12px] leading-relaxed">
                    No logs recorded yet. Perform actions or click tests inside the sandbox to inspect serialized dispatches to the App Inventor wrapper.
                  </span>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="border-b border-outline/5 pb-2.5 flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] text-outline">
                      <span>{log.timestamp}</span>
                      <span className="font-bold text-primary tracking-wider">{log.action}</span>
                    </div>
                    <div className="text-on-surface-variant break-all leading-normal bg-background/40 p-2 rounded-lg border border-outline/5">
                      {log.data ? JSON.stringify(log.data, null, 2) : 'null'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default DevSandbox;
