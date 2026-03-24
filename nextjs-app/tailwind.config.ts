import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      boxShadow: {
        "nb-shadow": "4px 4px 0px #0D0D0D",
        "nb-shadow-sm": "2px 2px 0px #0D0D0D",
        "nb-shadow-y": "4px 4px 0px #FFE500",
      },
      keyframes: {
        // Per-clap bounce: quick scale punch then settle
        "clap-bounce": {
          "0%":   { transform: "scale(1)" },
          "30%":  { transform: "scale(1.35)" },
          "60%":  { transform: "scale(0.92)" },
          "100%": { transform: "scale(1)" },
        },
        // Cap hit: horizontal shake
        "clap-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "15%":  { transform: "translateX(-5px)" },
          "30%":  { transform: "translateX(5px)" },
          "45%":  { transform: "translateX(-4px)" },
          "60%":  { transform: "translateX(4px)" },
          "75%":  { transform: "translateX(-2px)" },
          "90%":  { transform: "translateX(2px)" },
        },
        // "+N" label floats upward and fades out
        "float-up": {
          "0%":   { transform: "translateY(0)",    opacity: "1" },
          "100%": { transform: "translateY(-32px)", opacity: "0" },
        },
        // Subtle pulse on count after flush confirmation
        "count-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.15)" },
        },
      },
      animation: {
        "clap-bounce": "clap-bounce 300ms ease-out",
        "clap-shake":  "clap-shake 500ms ease-in-out",
        "float-up":    "float-up 700ms ease-out forwards",
        "count-pulse": "count-pulse 300ms ease-in-out",
      },
      colors: {
        black: "#0d0e12",
        white: "#fff",
        // NB palette
        "nb-black": "#0D0D0D",
        "nb-bg": "#F2EFE9",
        "nb-white": "#FFFFFF",
        "nb-yellow": "#FFE500",
        "nb-red": "#FF3B00",
        "nb-green": "#00E87A",
        "nb-blue": "#0062FF",
        // gray scale
        cyan: {
          50: "#e7fefe",
          100: "#c5fcfc",
          200: "#96f8f8",
          300: "#62efef",
          400: "#18e2e2",
          500: "#04b8be",
          600: "#037782",
          700: "#024950",
          800: "#042f34",
          900: "#072227",
          950: "#0d181c",
        },
        gray: {
          50: "#f6f6f8",
          100: "#eeeef1",
          200: "#e3e4e8",
          300: "#bbbdc9",
          400: "#9499ad",
          500: "#727892",
          600: "#515870",
          700: "#383d51",
          800: "#252837",
          900: "#1b1d27",
          950: "#13141b",
        },
        red: {
          50: "#fff6f5",
          100: "#ffe7e5",
          200: "#ffdedc",
          300: "#fdada5",
          400: "#f77769",
          500: "#ef4434",
          600: "#cc2819",
          700: "#8b2018",
          800: "#4d1714",
          900: "#321615",
          950: "#1e1011",
        },
        orange: {
          50: "#fcf1e8",
          100: "#f9e3d2",
          200: "#f4c7a6",
          300: "#efab7a",
          400: "#ea8f4e",
          500: "#e57322",
          600: "#ba5f1e",
          700: "#8f4b1b",
          800: "#653818",
          900: "#3a2415",
          950: "#251a13",
        },
        yellow: {
          50: "#fefae1",
          100: "#fcf3bb",
          200: "#f9e994",
          300: "#f7d455",
          400: "#f9bc15",
          500: "#d28a04",
          600: "#965908",
          700: "#653a0b",
          800: "#3b220c",
          900: "#271a11",
          950: "#181410",
        },
        green: {
          50: "#e7f9ed",
          100: "#d0f4dc",
          200: "#a1eaba",
          300: "#72e097",
          400: "#43d675",
          500: "#3ab564",
          600: "#329454",
          700: "#297343",
          800: "#215233",
          900: "#183122",
          950: "#14211a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        bricolage: ["var(--font-bricolage)"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
