/** @type {import('tailwindcss').Config} */
export default {
  // The content array defines where Tailwind should look for class names.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can customize your medical app's color palette here if needed
      // For now, we are using Tailwind's default robust color palette 
      // (blue-600, red-600, green-500, etc.) which is already highly accessible.
      colors: {
        brand: {
          light: '#eff6ff', // blue-50
          DEFAULT: '#2563eb', // blue-600
          dark: '#1e3a8a', // blue-900
        }
      }
    },
  },
  plugins: [],
}