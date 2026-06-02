import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium warm/earthy palette
        cream: "#F7F3EC",
        sand: "#EDE4D3",
        clay: "#C8A97E",
        bronze: "#A67C52",
        forest: "#2F3E35",
        moss: "#4A5D4E",
        charcoal: "#1C1B18",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(28, 27, 24, 0.18)",
      },
      keyframes: {
        fadeup: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeup: "fadeup 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
