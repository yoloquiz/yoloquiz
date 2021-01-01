const colors = require('tailwindcss/colors');
const { gridTemplateColumns } = require('tailwindcss/defaultTheme');

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
      blue: colors.blue,
      green: colors.emerald,
    },
    backgroundColor: (theme) => theme('colors'),
    gridTemplateColumns: {
      ...gridTemplateColumns,
      game: 'minmax(300px, 1fr) minmax(900px, 3fr)',
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
