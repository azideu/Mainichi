/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#f7f9fb", "surface-dim": "#d8dadc", "surface-bright": "#f7f9fb", "surface-container-lowest": "#ffffff", "surface-container-low": "#f2f4f6", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "surface-container-highest": "#e0e3e5", "on-surface": "#191c1e", "on-surface-variant": "#564338", "inverse-surface": "#2d3133", "inverse-on-surface": "#eff1f3", outline: "#897266", "outline-variant": "#ddc1b3", "surface-tint": "#9b4500", primary: "#9b4500", "on-primary": "#ffffff", "primary-container": "#ff8c42", "on-primary-container": "#6a2d00", "inverse-primary": "#ffb68d", secondary: "#006a65", "on-secondary": "#ffffff", "secondary-container": "#79f3ea", "on-secondary-container": "#006f69", tertiary: "#356668", "on-tertiary": "#ffffff", "tertiary-container": "#82b3b5", "on-tertiary-container": "#104648", error: "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a", "primary-fixed": "#ffdbc9", "primary-fixed-dim": "#ffb68d", "on-primary-fixed": "#331200", "on-primary-fixed-variant": "#763300", "secondary-fixed": "#7cf6ec", "secondary-fixed-dim": "#5dd9d0", "on-secondary-fixed": "#00201e", "on-secondary-fixed-variant": "#00504c", "tertiary-fixed": "#b9ecee", "tertiary-fixed-dim": "#9ecfd1", "on-tertiary-fixed": "#002021", "on-tertiary-fixed-variant": "#1a4e50", background: "#f7f9fb", "on-background": "#191c1e", "surface-variant": "#e0e3e5"
      },
      borderRadius: {
        sm: "0.25rem", DEFAULT: "0.5rem", md: "0.75rem", lg: "1rem", xl: "1.5rem", full: "9999px"
      },
      spacing: {
        base: "4px", xs: "8px", sm: "16px", md: "24px", lg: "32px", xl: "48px", "edge-margin": "20px", "card-gap": "16px", gutter: "16px", unit: "8px", "stack-lg": "32px", "stack-sm": "8px", "stack-md": "16px", "container-margin": "24px"
      },
      fontFamily: {
        "display-jp": ["Lexend", "sans-serif"], "headline-lg": ["Lexend", "sans-serif"], "headline-md": ["Lexend", "sans-serif"], "body-lg": ["Plus Jakarta Sans", "sans-serif"], "body-md": ["Plus Jakarta Sans", "sans-serif"], "label-caps": ["Plus Jakarta Sans", "sans-serif"], "button-text": ["Lexend", "sans-serif"], h1: ["Lexend", "sans-serif"], h2: ["Lexend", "sans-serif"], h3: ["Lexend", "sans-serif"], body: ["Plus Jakarta Sans", "sans-serif"], label: ["Plus Jakarta Sans", "sans-serif"]
      },
      fontSize: {
        "display-jp": ["48px", {lineHeight: "60px", fontWeight: "600"}], "headline-lg": ["32px", {lineHeight: "40px", fontWeight: "600"}], "headline-md": ["24px", {lineHeight: "32px", fontWeight: "500"}], "body-lg": ["18px", {lineHeight: "28px", fontWeight: "400"}], "body-md": ["16px", {lineHeight: "24px", fontWeight: "400"}], "label-caps": ["12px", {lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700"}], "button-text": ["16px", {lineHeight: "20px", fontWeight: "600"}], h1: ["32px", {lineHeight: "40px", fontWeight: "600"}], h2: ["32px", {lineHeight: "40px", fontWeight: "600"}], h3: ["24px", {lineHeight: "32px", fontWeight: "500"}]
      }
    }
  },
  plugins: [],
}
