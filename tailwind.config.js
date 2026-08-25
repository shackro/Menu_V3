/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#D4A574', // Warm mustard/brown
        secondary: '#B88A5E',
        dark: '#121212',
        'dark-card': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash': 'flash 0.5s ease-in-out',
      },
      keyframes: {
        flash: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)', backgroundColor: '#22c55e' },
        }
      }
    },
  },
  plugins: [],
};
