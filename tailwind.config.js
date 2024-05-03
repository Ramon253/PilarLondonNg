/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'main-white': '#FAFAFA',
        'font-grey': '#3E3E3E',
        'main-grey': '#F2F2F2',
        'main': '#012169',
        'secondary': '#C8102E',
        'dark-grey' : '#848484'
      },
    },
  },
  plugins: [],
}

