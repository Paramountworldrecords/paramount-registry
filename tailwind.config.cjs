/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#141210',
          50:  '#f7f6f5',
          100: '#e3e1de',
          200: '#c9c5c0',
          300: '#a8a29a',
          400: '#6f6a63',
          500: '#141210',
          600: '#110f0e',
          700: '#0d0c0b',
          800: '#080807',
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
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans:    ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(135deg, #D4AF37 0%, #f0d97a 40%, #D4AF37 60%, #a88b1a 100%)',
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(212,175,55,0.25)',
        'gold-lg': '0 0 60px rgba(212,175,55,0.35)',
        'navy':    '0 8px 32px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
