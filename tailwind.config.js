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
        surface: "#fbfcf8", "surface-dim": "#dce0d4", "surface-bright": "#fbfcf8", "surface-container-lowest": "#ffffff", "surface-container-low": "#f5f7f0", "surface-container": "#eff2e8", "surface-container-high": "#e9ede2", "surface-container-highest": "#e3e8db", "on-surface": "#191c18", "on-surface-variant": "#44483d", "inverse-surface": "#2e312c", "inverse-on-surface": "#f0f1ea", outline: "#74796e", "outline-variant": "#c4c8ba", "surface-tint": "#567d46", primary: "#567d46", "on-primary": "#ffffff", "primary-container": "#d9e3cf", "on-primary-container": "#141f0e", "inverse-primary": "#bcd0ab", secondary: "#7a8a64", "on-secondary": "#ffffff", "secondary-container": "#f1f4ed", "on-secondary-container": "#2a341e", tertiary: "#386567", "on-tertiary": "#ffffff", "tertiary-container": "#bcebec", "on-tertiary-container": "#002021", error: "#ba1a1a", "on-error": "#ffffff", "error-container": "#ffdad6", "on-error-container": "#93000a", "primary-fixed": "#d9e3cf", "primary-fixed-dim": "#bcd0ab", "on-primary-fixed": "#141f0e", "on-primary-fixed-variant": "#3e5430", "secondary-fixed": "#d9e7cb", "secondary-fixed-dim": "#bdcbaf", "on-secondary-fixed": "#161f00", "on-secondary-fixed-variant": "#445137", "tertiary-fixed": "#bcebec", "tertiary-fixed-dim": "#a1cfd0", "on-tertiary-fixed": "#002021", "on-tertiary-fixed-variant": "#1e4d4e", background: "#fbfcf8", "on-background": "#191c18", "surface-variant": "#e3e8db"
      },
      borderRadius: {
        sm: "0.125rem", DEFAULT: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", full: "9999px",
        // Organic irregular borders
      },
      boxShadow: {
        'ambient': '0 8px 30px rgba(86, 125, 70, 0.05), 0 4px 10px rgba(86, 125, 70, 0.02)',
        '3d': '0 4px 0px 0px var(--tw-shadow-color), 0 6px 15px -4px var(--tw-shadow-color)',
        'paper-layer': '0 2px 8px -2px rgba(86, 125, 70, 0.08), 0 1px 2px rgba(86, 125, 70, 0.05)',
      },
      backgroundImage: {
        'washi': "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E')",
      },
      spacing: {
        base: "8px", xs: "4px", sm: "12px", md: "24px", lg: "48px", xl: "80px", gutter: "24px", margin: "32px"
      },
      fontFamily: {
        h1: ["Lexend", "Zen Kaku Gothic New", "sans-serif"],
        h2: ["Lexend", "Zen Kaku Gothic New", "sans-serif"],
        h3: ["Lexend", "Zen Kaku Gothic New", "sans-serif"],
        "body-lg": ["Lexend", "Zen Kaku Gothic New", "sans-serif"],
        "body-md": ["Lexend", "Zen Kaku Gothic New", "sans-serif"],
        "label-sm": ["Lexend", "Zen Kaku Gothic New", "sans-serif"]
      },
      fontSize: {
        h1: ["28px", {lineHeight: "1.2", letterSpacing: "-0.025em", fontWeight: "700"}],
        h2: ["20px", {lineHeight: "1.3", letterSpacing: "-0.015em", fontWeight: "600"}],
        h3: ["16px", {lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600"}],
        "body-lg": ["15px", {lineHeight: "1.5", letterSpacing: "0.005em", fontWeight: "400"}],
        "body-md": ["13px", {lineHeight: "1.5", letterSpacing: "0.005em", fontWeight: "400"}],
        "label-sm": ["11px", {lineHeight: "1.2", letterSpacing: "0.04em", fontWeight: "600"}],
        "label-caps": ["10px", {lineHeight: "1.2", letterSpacing: "0.06em", fontWeight: "700"}]
      }
    }
  },
  plugins: [],
}
