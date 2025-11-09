/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/*/index.html",
    "./apps/*/src/**/*.{js,ts,jsx,tsx}",
    "./packages/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
