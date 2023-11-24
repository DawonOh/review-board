/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        132: '32rem',
      },
      screens: {
        md: '768px',
        lg: '1024px',
      },
      colors: {
        mainblue: '#676fa3',
        mainred: '#ff5959',
        buttongray: '#e0e0e0',
        mainsky: '#EEF2FF',
        white: '#fff',
        black: '#000',
      },
    },
  },
  plugins: [],
};
