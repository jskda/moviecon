/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f0f0f',
        secondary: '#1a1a1a',
        accent: '#e50914',
        gray: {
          800: '#2d2d2d',
          700: '#3d3d3d',
          600: '#4d4d4d',
        }
      },
    },
  },
  plugins: [],
}