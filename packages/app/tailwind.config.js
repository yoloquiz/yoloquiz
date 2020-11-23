const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.jsx'],
  theme: {
    colors: {
      primary: colors.cyan[700],
      success: colors.emerald[500],
    },
  },
  variants: {},
  plugins: [],
};
