/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F1B33",
        muted: "#5B6478",
        line: "#E2E6EE",
        card: "#FFFFFF",
        surface: "#F7F8FA",
        accent: "#2752E3",
        invest: "#0F9D58",
        pass: "#D93025",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 16px -4px rgba(15, 27, 51, 0.08)",
        card: "0 1px 2px rgba(15, 27, 51, 0.04), 0 8px 24px -8px rgba(15, 27, 51, 0.08)",
      },
    },
  },
  plugins: [],
};