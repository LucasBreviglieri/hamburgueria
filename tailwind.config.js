/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage:{
        "home": "ulr('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

