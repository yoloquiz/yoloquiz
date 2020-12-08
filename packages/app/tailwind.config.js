const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#00b0ff',
      success: colors.emerald[500],
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      green: colors.emerald,
    },
    backgroundColor: (theme) => theme('colors'),
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
