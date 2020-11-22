const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {
    colors: {
      primary: colors.cyan,
      success: colors.emerald,
      ...colors,
    },
  },
  variants: {
    extend: {
      ringWidth: ['hover', 'active'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
};
