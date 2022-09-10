/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      minHeight: {
        screen: '80vh',
      },
      maxWidth: {
        xxs: '80px',
      },
      fontSize: {
        xxs: '.6rem',
      },
    },
    fontFamily: {
      sans: ['Raleway', 'sans-serif'],
    },
  },
  plugins: [],
};
