/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        132: '32rem',
      },
      height: {
        '25rem': '25rem',
      },
      screens: {
        md: '768px',
        lg: '1024px',
      },
      colors: {
        mainblue: '#676fa3',
        mainred: '#ff5959',
        buttongray: '#e0e0e0',
        mainsky: '#CCDEFF',
        white: '#fff',
        black: '#000',
        'bg-gray': '#f5f5f5',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'category-open': {
          from: { visibility: 'hidden', 'margin-top': 0, opacity: 0 },
          '50%': { visibility: 'visible' },
          to: {
            visibility: 'visible',
            'margin-top': '3em',
            opacity: 1,
          },
        },
        'category-close': {
          from: { visibility: 'visible', 'margin-top': '3em', opacity: 1 },
          '50%': { visibility: 'visible' },
          to: {
            visibility: 'hidden',
            'margin-top': 0,
            opacity: 0,
          },
        },
        'category-default': {
          '0%, 100%': { display: 'none' },
        },
        move: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(0.5rem)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in forwards',
        'fade-in-slow': 'fade-in 1s ease-in 1s forwards',
        'category-open': 'category-open 500ms ease-in',
        'category-close': 'category-close 500ms ease-in',
        'category-default': 'category-default',
        move: 'move 2s ease-in-out infinite',
      },
      minHeight: {
        '2.5rem': '2.5rem',
      },
      gridTemplateColumns: {
        card: 'repeat(auto-fill, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [],
};
