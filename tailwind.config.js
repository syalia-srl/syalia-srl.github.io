// Theme shared by every page. Rebuild assets/tailwind.css with `make css`
// after changing classes in any page or script.
module.exports = {
  content: ['./**/*.html', './js/**/*.js', '!./docs/**', '!./node_modules/**'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { 100: '#e9ecf5', 200: '#cfd5e6', 300: '#a3aece', 400: '#6e7ba0', 500: '#475070', 600: '#2e3450', 700: '#1c2138', 800: '#11152a', 900: '#0a0d1f', 950: '#05071a' },
        syalia: { 300: '#86b3da', 400: '#5b8fc4', 500: '#3e72ad', 600: '#5281a3', 700: '#3d6584' },
        accent: { 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b' },
      },
    },
  },
};
