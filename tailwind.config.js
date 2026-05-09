export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          950: '#090707',
          900: '#111111',
          gold: '#c9a76a',
        },
      },
    },
  },
  plugins: [],
};
