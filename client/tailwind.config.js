/** @type {import('tailwindcss').Config} */
import tailwindAnimated from 'tailwindcss-animated';
import tailwindScrollbar from 'tailwind-scrollbar'
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  darkMode: 'selector',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'font-inter',
    'font-roboto',
    'font-opensans',
    'font-lato',
    'font-montserrat',
    'font-poppins',
    'font-raleway',
    'font-merriweather',
    'font-playfair',
    'font-firacode',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
        opensans: ['"Open Sans"', ...defaultTheme.fontFamily.sans],
        lato: ['Lato', ...defaultTheme.fontFamily.sans],
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
        raleway: ['Raleway', ...defaultTheme.fontFamily.sans],
        merriweather: ['Merriweather', ...defaultTheme.fontFamily.serif],
        playfair: ['"Playfair Display"', ...defaultTheme.fontFamily.serif],
        firacode: ['"Fira Code"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        
      },
      backgroundImage: {
        
      },
    },
  },
  plugins: [
    tailwindAnimated,
    tailwindScrollbar
  ],
  important: true
}
