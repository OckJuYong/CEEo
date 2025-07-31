/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#F2F2F7',
        surface: '#FFFFFF',
        text: '#000000',
        'text-secondary': '#8E8E93',
      },
    },
  },
  plugins: [],
}