/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'premium-dark': '#121418',
        'premium-light': '#F5F7FA',
        'premium-accent': '#5E81AC',
      },
    },
  },
  plugins: [],
}
