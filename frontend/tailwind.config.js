/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      backgroundColor: {
        bgDarkPrimary: '#2A2438',
        bgDark: '#1F1D1D',
        bgDarkSecondary: '#352F44',
        highlightDark: '#DBD8E3',
        highlightDarkSecondary: '#5C5470',

        bgLightSecondary: '#e4e5f1',
        bgLightPrimary: '#fafafa',
      },
      textColor: {
        darkMain: '#1F1D1D',
        darkPrimary: '#2A2438',
        darkSecondary: '#352F44',
        highlightDark: '#DBD8E3',
        highlightDarkSecondary: '#5C5470',
      },
    },
  },
  plugins: [],
};
