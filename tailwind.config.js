/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${variableName}) / ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

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
          50: withOpacity('--color-parchment-50'),
          100: withOpacity('--color-parchment-100'),
          200: withOpacity('--color-parchment-200'),
          300: withOpacity('--color-parchment-300'),
          400: withOpacity('--color-parchment-400'),
          500: withOpacity('--color-parchment-500'),
          800: withOpacity('--color-parchment-800'),
          900: withOpacity('--color-parchment-900'),
          950: withOpacity('--color-parchment-950'),
        },
        ink: {
          light: withOpacity('--color-ink-light'),
          DEFAULT: withOpacity('--color-ink'),
          deep: withOpacity('--color-ink-deep'),
        },
        rust: {
          light: withOpacity('--color-rust-light'),
          DEFAULT: withOpacity('--color-rust'),
          dark: withOpacity('--color-rust-dark'),
        },
        sage: {
          50: withOpacity('--color-sage-50'),
          100: withOpacity('--color-sage-100'),
          500: withOpacity('--color-sage-500'),
          700: withOpacity('--color-sage-700'),
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
