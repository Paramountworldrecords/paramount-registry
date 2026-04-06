/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#080808',
          50:  '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#a3a3a3',
          400: '#6b6b6b',
          500: '#121212',
          600: '#0f0f0f',
          700: '#0c0c0c',
          800: '#080808',
          900: '#030303',
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
        display: ['Anton', 'Impact', 'Arial Narrow', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        sans:    ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
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
