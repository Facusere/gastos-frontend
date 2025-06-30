/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // Opcional, útil si piensas agregar modo oscuro
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        background: {
          light: '#f9fafb',
          DEFAULT: '#ffffff',
        },
        text: {
          DEFAULT: '#1f2937',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        inter: ['Inter', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 10px rgba(59, 130, 246, 0.1)',
        modal: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      ringColor: {
        primary: '#3b82f6',
      },
      outlineColor: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
};

