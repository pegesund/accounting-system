/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // In dev mode, we import MFEs directly, so scan their files too
    "../dashboard/src/**/*.{js,ts,jsx,tsx}",
    "../invoicing/src/**/*.{js,ts,jsx,tsx}",
    "../expenses/src/**/*.{js,ts,jsx,tsx}",
    "../reports/src/**/*.{js,ts,jsx,tsx}",
    "../clients/src/**/*.{js,ts,jsx,tsx}",
    "../settings/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
