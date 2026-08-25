import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1930", light: "#122A4D", deep: "#060F1F" },
        cyan: { DEFAULT: "#14C7D6", light: "#5FE3EE" },
        skyblue: "#4E8FF7",
        amber: { DEFAULT: "#F5A623", light: "#FFC862" }
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      },
      backgroundImage: {
        "fiber-grid": "radial-gradient(circle at 1px 1px, rgba(20,199,214,0.15) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
export default config;
