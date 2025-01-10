const plugin = require('tailwindcss/plugin');

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ], theme: {
    extend: {
      animation: {
        'gradient-change': 'gradientBG 5s infinite',
      },
      keyframes: {
        gradientBG: {
          '0%': { background: 'linear-gradient(to right, #3b82f6, #a855f7)' },
          '50%': { background: 'linear-gradient(to right, #f59e0b, #ef4444)' },
          '100%': { background: 'linear-gradient(to right, #3b82f6, #a855f7)' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.gradient-animate': {
          animation: 'gradient-change 5s infinite',
        },
      });
    }),
  ],
}
