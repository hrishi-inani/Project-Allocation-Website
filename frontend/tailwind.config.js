/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow:{
        "light-card":'24px 24px 40px #efefff,-24px -24px 50px #efefff',
        "hover-light-card":'24px 24px 50px #c1c1fe,-24px -24px 50px #c1c1fe',
        "light-button": 'inset 2px 2px 8px #efefef, inset -2px -2px 5px #efefef',
        "hover-light-button" : '8px 8px 10px #efefef, -10px -10px 10px #efefef'
      }
    },
  },
  plugins: [],
}