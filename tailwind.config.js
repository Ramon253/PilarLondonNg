/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            boxShadow: {
                'assignment-card': '-10px -10px 30px 4px rgba(0,0,0,0.1), 10px 10px 30px 4px rgba(45,78,255,0.15)',
                'button-hover': '5px 5px 0px 0px rgba(200, 16, 46, 1);',
            },
            colors: {
                'main-white': '#FAFAFA',
                'font-grey': '#3E3E3E',
                'main-grey': '#F2F2F2',
                'main': '#012169',
                'secondary': '#C8102E',
                'secondary-blue' : '#384F83',
                'secondary-font-grey' : '#BEBEBE',
                'dark-grey': '#848484',
                'light-blue': '#DEE8FF',
                'secondary-grey': '#848484',
                'dark-font': '#1F1F1F'
            },
        },
    },
    plugins: [],
}

