/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f1fb',
          200: '#b5d4f4',
          400: '#378add',
          600: '#185fa5',
          900: '#042c53',
        },
        success: {
          50: '#eaf3de',
          400: '#639922',
          600: '#3b6d11',
        },
        warning: {
          50: '#faeeda',
          400: '#ba7517',
          600: '#854f0b',
        },
        danger: {
          50: '#fcebeb',
          400: '#e24b4a',
          600: '#a32d2d',
        },
      },
    },
  },
  plugins: [],
};
