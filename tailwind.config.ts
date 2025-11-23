import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          light: "#f8fafc",
          dark: "#0f172a"
        },
        card: {
          light: "#ffffff",
          dark: "#0b1324"
        },
        accent: {
          DEFAULT: "#2563eb",
          soft: "#dbeafe"
        },
        border: {
          light: "#e2e8f0",
          dark: "#1e293b"
        }
      },
      boxShadow: {
        card: "0 10px 50px rgba(15, 23, 42, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
