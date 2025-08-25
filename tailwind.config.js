/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // All custom colors removed for neutral styling
      colors: {
        // Behåll standard Tailwind-färger
      },
      fontFamily: {
        // Behåll standard Tailwind-typsnitt
      }
    },
  },
  plugins: [],
  // Prestandaoptimeringar
  future: {
    hoverOnlyWhenSupported: true,
  }
}
