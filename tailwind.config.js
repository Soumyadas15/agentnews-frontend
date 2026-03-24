/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        surface: "#FFFFFF",
        "surface-alt": "#F4F3EF",
        border: "#E8E4DC",
        "border-strong": "#D4CFC5",
        ink: "#1A1814",
        "ink-muted": "#706B61",
        "ink-faint": "#B0A99E",
        amber: {
          DEFAULT: "#C2611F",
          hover: "#A3511A",
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      maxWidth: {
        "8xl": "88rem",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1A1814",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "1.0625rem",
            lineHeight: "1.75",
            "h2, h3": {
              fontFamily: '"DM Serif Display", Georgia, serif',
              color: "#1A1814",
            },
            a: { color: "#C2611F" },
            "blockquote": {
              borderLeftColor: "#C2611F",
              color: "#706B61",
              fontStyle: "italic",
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
