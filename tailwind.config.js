import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['Lato', ...defaultTheme.fontFamily.sans],
      // },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
    },
  },
  plugins: [
    heroui({
      addCommonColors: true,
      // layout: {
      //   radius: {
      //     small: '2px', // rounded-small
      //     medium: '4px', // rounded-medium
      //     large: '6px', // rounded-large
      //   },
      //   borderWidth: {
      //     small: '1px', // border-small
      //     medium: '1px', // border-medium
      //     large: '2px', // border-large
      //   },
      // },
    }),
    require('@tailwindcss/typography'),
  ],
}
