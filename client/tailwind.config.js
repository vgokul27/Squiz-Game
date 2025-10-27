/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        dark: {
          50: "#18181b",
          100: "#27272a",
          200: "#3f3f46",
          300: "#52525b",
          400: "#71717a",
          500: "#a1a1aa",
          600: "#d4d4d8",
          700: "#e4e4e7",
          800: "#f4f4f5",
          900: "#fafafa",
        },
      },
      backgroundImage: {
        "gradient-purple": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      boxShadow: {
        neon: "0 0 20px rgba(168, 85, 247, 0.4)",
        "neon-lg": "0 0 30px rgba(168, 85, 247, 0.6)",
        "neon-xl": "0 0 40px rgba(168, 85, 247, 0.8)",
      },
    },
  },
  plugins: [],
};
