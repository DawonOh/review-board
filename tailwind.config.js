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
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in forwards',
        'fade-in-slow': 'fade-in 1s ease-in 1s forwards',
      },
    },
  },
  plugins: [],
};
