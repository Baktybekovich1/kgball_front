/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',
  theme: {
    fontFamily: {
      serif: ['Montserrat', 'serif'],
      sans: ['Montserrat', 'sans-serif'],
    },
    colors: {
      blue: '#0589c7',
      sun: '#faa918',
      yellow: '#ffc715',
      red: '#d33131',
      cinnabar: '#e53838',
      alto: ' #cfcfcf',
      dove: '#6f6f6f',
      tundora: '#747F8A',
      white: 'white',
      black: 'black',
      violet: '#8f95cd',
      milk: '#fe98c8',
    },
    screens: {
      'max-xl': { max: '1440px' },
      'max-lg': { max: '1024px' },
      'max-md': { max: '768px' },
      'max-sm': { max: '480px' },
      'max-xs': { max: '360px' },
    },
    plugins: [],
  },
}
