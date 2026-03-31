/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fff7ec",
          100: "#ffedd3",
          200: "#ffd7a6",
          300: "#ffb96e",
          400: "#ff9034",
          500: "#ff700c",
          600: "#e34e02",
          700: "#ca3d04",
          800: "#a0300c",
          900: "#812a0d",
          950: "#461204",
        }, // Modern vibrant blue
        secondary: "#0f172a", // Slate 900 for dark text/elements
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Recommend adding Inter font from Google Fonts in index.html
      },
    },
  },
  plugins: [],
};
