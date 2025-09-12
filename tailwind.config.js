/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        typewriter: ['Courier New', 'Courier', 'Monaco', 'monospace'],
        retro: ['American Typewriter', 'serif'],
      },
    },
  },
  plugins: [],
};
