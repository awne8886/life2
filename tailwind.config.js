/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fcfbf9',
          100: '#f7f5ef',
          200: '#efece0',
          300: '#dfdac8',
          400: '#c5bfa7',
          500: '#a8a085',
          800: '#2b2a26',
          900: '#1a1917',
          950: '#100f0d',
        },
        ink: {
          light: '#3d3c37',
          DEFAULT: '#1c1b18',
          deep: '#0f0e0c',
        },
        rust: {
          light: '#b85438',
          DEFAULT: '#8b3822',
          dark: '#682715',
        },
        sage: {
          50: '#f4f6f3',
          100: '#e5eae3',
          500: '#5c7860',
          700: '#354c39',
        }
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Newsreader"', '"Merriweather"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
