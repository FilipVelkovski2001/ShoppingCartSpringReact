/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      colors: {
        cream: {
          50:  "#fdfcfb",
          100: "#f9f6f2",
          200: "#f2ece3",
        },
        brand: {
          50:  "#f5f0eb",
          100: "#e8ddd3",
          200: "#d4c4b4",
          300: "#bda890",
          400: "#a68c6e",
          500: "#8f7055",
          600: "#755a42",
          700: "#5c4433",
          800: "#433025",
          900: "#2c1e17",
        },
      },
      boxShadow: {
        soft:     "0 2px 20px 0 rgba(0,0,0,0.06)",
        card:     "0 4px 32px 0 rgba(0,0,0,0.08)",
        elevated: "0 8px 48px 0 rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
