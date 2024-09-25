/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit',
      },
      boxShadow: {
        volume: '0px 0px 0px 6px rgba(237, 233, 254, 0.5)',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
