import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#6B2030",
        maroonDark: "#4A1620",
        gold: "#B8862F",
      },
    },
  },
  plugins: [],
};
export default config;
