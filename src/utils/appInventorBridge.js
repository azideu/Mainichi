/**
 * MIT App Inventor Bridge Utility
 * This file handles communication between your React web app and the MIT App Inventor mobile wrapper.
 */

// Send a message/data from React to MIT App Inventor
export const sendToAppInventor = (message) => {
  // MIT App Inventor's WebViewer exposes a global 'window.AppInventor' object
  if (window.AppInventor) {
    window.AppInventor.setWebViewString(message);
    console.log("Sent to App Inventor:", message);
  } else {
    // Fallback for local development or regular browser usage
    console.log("App Inventor bridge not found. Message would be:", message);
  }
};

// Example usage constants you might want to use:
export const APP_INVENTOR_EVENTS = {
  LESSON_COMPLETE: "lesson_complete",
  VIBRATE_PHONE: "vibrate_phone",
  PLAY_SUCCESS_SOUND: "play_success_sound",
  SAVE_STREAK: "save_streak_local",
};
