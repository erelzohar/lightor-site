/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#000000',
          dark: '#111111',
          light: '#f8f8f8'
        }
      }
    },
  },
  plugins: [],
};