/** @type {import('tailwindcss').Config} */
import tailwindAnimated from 'tailwindcss-animated';
import tailwindScrollbar from 'tailwind-scrollbar'
export default {
  darkMode: 'selector',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
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
