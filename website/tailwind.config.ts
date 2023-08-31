import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        base: {
          // background
          100: "rgb(var(--color-base-100) / <alpha-value>)",
          200: "rgb(var(--color-base-200) / <alpha-value>)",
          300: "rgb(var(--color-base-300) / <alpha-value>)",
          400: "rgb(var(--color-base-400) / <alpha-value>)",
        },
        content: {
          // foreground
          100: "rgb(var(--color-content-100) / <alpha-value>)",
          200: "rgb(var(--color-content-200) / <alpha-value>)",
          300: "rgb(var(--color-content-300) / <alpha-value>)",
          400: "rgb(var(--color-content-400) / <alpha-value>)",
        },
        neutral: {
          // divide
          100: "rgb(var(--color-neutral-100) / <alpha-value>)",
          200: "rgb(var(--color-neutral-200) / <alpha-value>)",
          300: "rgb(var(--color-neutral-300) / <alpha-value>)",
          400: "rgb(var(--color-neutral-400) / <alpha-value>)",
        },
        primary: {
          // button background
          100: "rgb(var(--color-primary-100) / <alpha-value>)", // default
          200: "rgb(var(--color-primary-200) / <alpha-value>)", // hover
        },
        "primary-content": {
          // button foreground
          100: "rgb(var(--color-primary-content-100) / <alpha-value>)", // default
          200: "rgb(var(--color-primary-content-200) / <alpha-value>)", // hover
        },
      },
    },
  },
  plugins: [],
}
export default config
