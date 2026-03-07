import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#4338CA",
          light: "#6366F1",
          dark: "#312E81",
        },
        accent: "#F59E0B",
        surface: "#F8F7FF",
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          700: "#4338CA",
          900: "#312E81",
          950: "#1E1B4B",
        },
        text: {
          primary: "#1E1B4B",
          secondary: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};

export default config;
