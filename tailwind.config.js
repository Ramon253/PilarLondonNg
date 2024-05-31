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
                'main': 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
                'card' : 'rgba(0, 0, 0, 0.35) 0px 5px 15px;',
                'soft' : 'rgba(0, 0, 0, 0.24) 0px 3px 8px;'
            },
            colors: {
                'main-white': '#FAFAFA',
                'font-grey': '#3E3E3E',
                'main-grey': '#F2F2F2',
                'main': '#012169',
                'secondary': '#C8102E',
                'secondary-blue': '#384F83',
                'secondary-font-grey': '#BEBEBE',
                'dark-grey': '#848484',
                'light-blue': '#DEE8FF',
                'secondary-grey': '#848484',
                'dark-font': '#1F1F1F',

            },
            backgroundImage: theme => ({
                'landing-gradient': 'linear-gradient(135deg, rgba(250,250,250,1) 0%, rgba(250,250,250,1) 45%, rgba(1,33,105,1) 100%);'
                // Add more gradients if needed
            }),
            fontFamily : {
                'landing' : 'judson, san-serif'
            }
        },
    },
    plugins: [],
}

