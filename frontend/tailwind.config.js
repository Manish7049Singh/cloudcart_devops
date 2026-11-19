/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fb',
          100: '#e8edf6',
          200: '#ccd8ed',
          300: '#a1bbdf',
          400: '#6f97ce',
          500: '#4b78bd',
          600: '#385fa2',
          700: '#2e4d84',
          800: '#28416d',
          900: '#1e2e4f',
          950: '#131e34',
        },
      },
    },
  },
  plugins: [],
}
