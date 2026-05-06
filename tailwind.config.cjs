/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1d2b6b',
          teal: '#48c9b0',
          red: '#e63946',
        },
        navy: {
          DEFAULT: '#1d2b6b',
          50:  '#f4f6fb',
          100: '#e8eaf4',
          200: '#c9cfe8',
          300: '#9aa6d4',
          400: '#6b7bb8',
          500: '#1d2b6b',
          600: '#1a265f',
          700: '#162456',
          800: '#121c45',
          900: '#0c1230',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50:  '#fdf8e6',
          100: '#f9ecb3',
          200: '#f0d980',
          300: '#e6c44d',
          400: '#D4AF37',
          500: '#b8951e',
          600: '#9c7b18',
          700: '#7a5f12',
          800: '#58440d',
          900: '#362a08',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(135deg, #D4AF37 0%, #f0d97a 40%, #D4AF37 60%, #a88b1a 100%)',
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(212,175,55,0.25)',
        'gold-lg': '0 0 60px rgba(212,175,55,0.35)',
        'navy':    '0 8px 32px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
