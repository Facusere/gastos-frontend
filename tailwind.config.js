/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F80ED',
        lightblue: '#EAF4FE',
        dark: '#333333',
        graymid: '#828282',
        graylight: '#BDBDBD',
        success: '#27AE60',
        error: '#EB5757',
      },
      borderRadius: {
        xl: '16px',
      },
      fontFamily: {
        inter: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
