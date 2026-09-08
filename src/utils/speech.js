/**
 * Web Speech API utility for Japanese Text-to-Speech (TTS) pronunciation.
 * Provides standard browser-native pronunciation without external wrapper dependencies.
 */

/**
 * Pronounce Japanese text using the standard Web Speech API.
 * @param {string} text - The Japanese text to be spoken
 * @param {number} rate - Speech rate (default: 0.8)
 * @param {string|null} voiceURI - Optional specific voice URI to use
 */
export const speakText = (text, rate = 0.8, voiceURI = null) => {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate;

    if (voiceURI && typeof window.speechSynthesis.getVoices === 'function') {
      const allVoices = window.speechSynthesis.getVoices() || [];
      const targetVoice = allVoices.find((v) => v && v.voiceURI === voiceURI);
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('SpeechSynthesis failed:', err);
  }
};
