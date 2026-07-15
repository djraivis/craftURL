/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--accent)',
        secondary: 'var(--bg-elevated)',
        dark: 'var(--bg-surface)',
        accent: 'var(--accent-strong)'
      },
      fontFamily: {
        sans: ['var(--font-ui)'],
        mono: ['var(--font-mono)']
      }
    }
  },
  plugins: []
};
