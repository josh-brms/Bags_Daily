import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F6',
        deep: '#F3EEE9',
        surface: '#FFFFFF',
        ink: '#211D1B',
        'ink-hover': '#3D3632',
        muted: '#6E645F',
        line: '#E4DCD6',
        clay: '#B4693A',
        'clay-deep': '#8A5A3A',
        blush: '#E8B4B8',
        'blush-deep': '#D1939A',
        lilac: '#C4B1D4',
        'lilac-deep': '#A38CBC',
        butter: '#F2D9A0',
        mint: '#B7D4C4'
      },
      fontFamily: {
        sans: ['Manrope', 'Manrope Fallback', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Fraunces Fallback', 'Georgia', 'Cambria', 'serif'],
        brand: ['Quicksand', 'Quicksand Fallback', 'Century Gothic', 'URW Gothic', 'Avenir Next', 'Trebuchet MS', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '10px',
        md: '12px',
        lg: '18px',
        xl: '26px',
        '2xl': '34px',
        pill: '999px'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(33,29,27,0.05), 0 10px 30px rgba(33,29,27,0.07)',
        lift: '0 8px 20px -6px rgba(33,29,27,0.12), 0 24px 48px -12px rgba(33,29,27,0.14)',
        glow: '0 10px 40px -8px rgba(180,105,58,0.42)',
        'glow-blush': '0 10px 40px -8px rgba(232,180,184,0.5)',
        'glow-lilac': '0 10px 40px -8px rgba(196,177,212,0.5)'
      }
    }
  },
  plugins: [animate]
} satisfies Config
