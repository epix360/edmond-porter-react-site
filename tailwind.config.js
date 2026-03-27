/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#162839",
        "primary-container": "#2c3e50",
        "secondary": "#805533",
        "secondary-container": "#fdc39a",
        "tertiary": "#182837",
        "tertiary-container": "#2e3e4d",
        "background": "#f9f9f7",
        "surface": "#f9f9f7",
        "surface-bright": "#f9f9f7",
        "surface-dim": "#dadad8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f4f4f2",
        "surface-container": "#eeeeec",
        "surface-container-high": "#e8e8e6",
        "surface-container-highest": "#e2e3e1",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-background": "#1a1c1b",
        "on-surface": "#1a1c1b",
        "on-surface-variant": "#43474c",
        "on-primary-container": "#96a9be",
        "on-secondary-container": "#794e2e",
        "on-tertiary-container": "#98a9bb",
        "outline": "#74777d",
        "outline-variant": "#c4c6cd",
        "tertiary-fixed": "#d3e4f8",
        "tertiary-fixed-dim": "#b8c8db",
        "primary-fixed": "#d1e4fb",
        "primary-fixed-dim": "#b5c8df",
        "secondary-fixed": "#ffdcc5",
        "secondary-fixed-dim": "#f4bb92",
      },
      fontFamily: {
        "headline": ["Noto Serif", "serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem", 
        "lg": "0.25rem", 
        "xl": "0.5rem", 
        "full": "0.75rem"
      },
    },
  },
  plugins: [],
}
