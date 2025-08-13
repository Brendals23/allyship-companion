/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        tealSoft: "#5CC7C1",
        coralWarm: "#FF7A70",
        navyDeep: "#0B2E4F"
      }
    }
  },
  plugins: []
};
