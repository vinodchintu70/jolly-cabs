/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#6366f1', dark: '#4f46e5' },
        secondary: '#8b5cf6',
        dark: { DEFAULT: '#0f172a', card: '#1e293b', border: '#334155' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        glow: { from: { boxShadow: '0 0 10px #6366f1' }, to: { boxShadow: '0 0 30px #8b5cf6' } },
      },
    },
  },
  plugins: [],
};
