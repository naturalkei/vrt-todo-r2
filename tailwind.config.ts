import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Baloo 2', 'Noto Sans KR', 'system-ui', 'sans-serif'],
        'bubbly': ['Baloo 2', 'cursive'],
        'korean': ['Noto Sans KR', 'sans-serif'],
      },
      colors: {
        // Nook Exchange / Animal Crossing Palette
        'nook': {
          'cream': '#FFF8E7',
          'cream-dark': '#FFE4BC',
          'mint': '#B8E6D5',
          'mint-dark': '#8ED3B8',
          'sky': '#C9E4F5',
          'sky-dark': '#A5D3F0',
          'peach': '#FFD5C2',
          'peach-dark': '#FFBB9F',
          'yellow': '#FFF4A3',
          'yellow-dark': '#FFE87C',
          'brown': '#8B6F47',
          'brown-dark': '#6B5434',
          'green': '#7EC850',
          'green-dark': '#5FA732',
        },
      },
      borderRadius: {
        'bubble': '1.5rem',
        'bubbly': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'bubble': '0 4px 16px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(126, 200, 80, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config