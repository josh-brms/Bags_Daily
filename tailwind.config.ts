import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F6',
        deep: '#F3EEE9',
        surface: '#FFFFFF',
        ink: '#211D1B',
        muted: '#6E645F',
        line: '#E4DCD6',
        clay: '#B4693A'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '6px',
        pill: '999px'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(33,29,27,0.05), 0 10px 30px rgba(33,29,27,0.07)'
      }
    }
  },
  plugins: []
} satisfies Config
