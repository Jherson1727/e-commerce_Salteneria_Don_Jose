/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'donjose-orange': '#FF8434',
        'donjose-cream': '#F5E6C8',
        'donjose-brown': '#6B2D24',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'donjose': '0 10px 25px -5px rgba(107, 45, 36, 0.1), 0 8px 10px -6px rgba(107, 45, 36, 0.05)',
        'donjose-lg': '0 20px 30px -10px rgba(107, 45, 36, 0.15)',
      }
    },
  },
  plugins: [],
}
