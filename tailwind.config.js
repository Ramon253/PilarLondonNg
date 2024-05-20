/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow : {
        'assignment-card' : 'box-shadow: 0 60px 80px rgba(0,0,0,0.60), 0 45px 26px rgba(0,0,0,0.14)'
      },
      colors: {
        'main-white': '#FAFAFA',
        'font-grey': '#3E3E3E',
        'main-grey': '#F2F2F2',
        'main': '#012169',
        'secondary': '#C8102E',
        'dark-grey' : '#848484',
        'light-blue' : '#DEE8FF',
        'secondary-grey' : '#848484',
        'dark-font' : '#1F1F1F'
      },
    },
  },
  plugins: [],
}

