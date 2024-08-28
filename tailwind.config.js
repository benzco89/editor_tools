module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      textAlign: {
        start: 'right',
        end: 'left',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};