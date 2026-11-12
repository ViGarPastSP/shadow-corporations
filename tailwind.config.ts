import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#07080b",
        surface: "#0f1218",
        surface2: "#151922",
        border: "#232834",
        primary: "#c8102e",
        primaryHover: "#a30d26",
        accent: "#ff2f4d",
        gold: "#d4a24c",
        muted: "#8a93a5",
        success: "#2fbf71",
        warning: "#e0a21a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
