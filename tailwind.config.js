/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background:      "var(--bg)",
        surface:         "var(--bg-surface)",
        "surface-alt":   "var(--bg-alt)",
        border:          "var(--border)",
        "border-strong": "var(--border-strong)",
        ink: {
          DEFAULT: "var(--ink)",
          muted:   "var(--ink-muted)",
          faint:   "var(--ink-faint)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          hover:   "var(--amber-hover)",
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
        mono:  ['"DM Mono"', "monospace"],
      },
      maxWidth: { "8xl": "88rem" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
