/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1C1C1E",
          soft: "#3A3A3D",
          muted: "#6B7280",
        },
        brand: {
          50: "#FFF6EC",
          100: "#FFEEDC",
          200: "#FFE1C2",
          300: "#FFCC94",
          400: "#FF9C4D",
          500: "#FF7A1A",
          600: "#E35F00",
          700: "#C74F00",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "28px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(28,28,30,0.06)",
        "card-hover": "0 24px 40px rgba(28,28,30,0.14)",
        soft: "0 8px 24px rgba(28,28,30,0.10)",
        "brand-glow": "0 10px 24px rgba(255,122,26,0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};