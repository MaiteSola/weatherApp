/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#0f1014', // Deep dark for main background
        'surface-dark': '#1e1f29',    // Slightly lighter for cards/surfaces
        'border-dark': 'rgba(255, 255, 255, 0.08)', // Subtle borders
        'primary': '#4DB5F4',         // Light blue/Cyan for icons/accents
      },
      fontFamily: {
        'sans': ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
