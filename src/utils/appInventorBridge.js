/**
 * MIT App Inventor Bridge Utility
 * This file handles communication between your React web app and the MIT App Inventor mobile wrapper.
 * 
 * Documentation for MIT App Inventor Integration:
 * - Use 'setWebViewString' to send data to the App blocks.
 * - App blocks should watch for 'WebViewStringChange' event.
 */

export const IS_APP_INVENTOR = !!window.AppInventor;

/**
 * Sends a command to MIT App Inventor
 * @param {string} action - The action type (e.g., 'SPEAK', 'VIBRATE', 'SAVE_TINYDB')
 * @param {any} data - The payload for the action
 */
export const sendToAppInventor = (action, data = null) => {
  const isSandbox = window.location.pathname === '/sandbox';
  const message = JSON.stringify({ action, data, isSandbox, timestamp: Date.now() });
  
  // Dispatch a custom event to update the hidden Developer Sandbox Console logger
  window.dispatchEvent(new CustomEvent('app-bridge-log', {
    detail: { action, data, timestamp: new Date().toLocaleTimeString() }
  }));
  
  if (window.AppInventor) {
    window.AppInventor.setWebViewString(message);
    console.log("Sent to App Inventor:", message);
  } else {
    console.log("App Inventor bridge not found. Action would be:", action, data);
  }
};

/**
 * Text-to-Speech: Command the app to speak text
 * @param {string} text - The text to be spoken (e.g., Japanese vocabulary)
 */
export const speakText = (text) => {
  sendToAppInventor("SPEAK", { text });
  
  // HTML5 Web Speech Synthesis fallback for browser previews
  if (!window.AppInventor && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.cancel(); // Stop any current speaking
    window.speechSynthesis.speak(utterance);
  }
};

/**
 * TinyDB: Save data locally on the device
 * @param {string} tag - The tag/key for TinyDB
 * @param {any} value - The value to store
 */
export const saveToTinyDB = (tag, value) => {
  sendToAppInventor("SAVE_TINYDB", { tag, value });
};

/**
 * TinyDB: Request data from the device
 * Note: App Inventor must respond by calling setWebViewString with action "TINYDB_RESPONSE"
 * @param {string} tag - The tag/key to retrieve
 */
export const getFromTinyDB = (tag) => {
  sendToAppInventor("GET_TINYDB", { tag });
};

/**
 * Media: Play a sound effect or audio file
 * @param {string} fileName - The name of the file in App Inventor's assets
 */
export const playMedia = (fileName) => {
  sendToAppInventor("PLAY_MEDIA", { file: fileName });
};

/**
 * Sensors: Request sensor data (e.g., Accelerometer)
 */
export const requestSensorData = (sensorType = "ACCELEROMETER") => {
  sendToAppInventor("GET_SENSOR", { type: sensorType });
};

/**
 * App Inventor Event Handler
 * Call this in your App.jsx to listen for responses from the App blocks
 */
export const initAppInventorListener = (callback) => {
  // We use a custom event or poll the webViewString if needed, 
  // but usually we just listen for changes if the app sends data back.
  // In many implementations, we might need a global function that the app calls
  // OR the app just changes the webViewString and we detect it.
  
  // Best practice: The app calls a global function on the window
  window.onAppInventorData = (jsonString) => {
    try {
      const payload = JSON.parse(jsonString);
      callback(payload);
    } catch (e) {
      console.error("Failed to parse App Inventor data:", e);
    }
  };
};

export const APP_INVENTOR_ACTIONS = {
  SPEAK: "SPEAK",
  SAVE_TINYDB: "SAVE_TINYDB",
  GET_TINYDB: "GET_TINYDB",
  PLAY_MEDIA: "PLAY_MEDIA",
  VIBRATE: "VIBRATE",
  GET_SENSOR: "GET_SENSOR",
  START_SPEECH_RECOGNITION: "START_SPEECH_RECOGNITION",
  SET_REMINDER: "SET_REMINDER",
  CONNECTION_STATUS: "CONNECTION_STATUS"
};
