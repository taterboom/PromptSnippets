import defaultTheme from "tailwindcss/defaultTheme"

// tailwindcss use rem as unit, it will be broken in mail world if the <html> font-size is not 16px
// so we need to convert rem to px
// see https://github.com/tailwindlabs/tailwindcss/issues/1232
function rem2px(input, fontSize = 16) {
  if (input == null) {
    return input
  }
  switch (typeof input) {
    case "object":
      if (Array.isArray(input)) {
        return input.map((val) => rem2px(val, fontSize))
      }
      // eslint-disable-next-line no-case-declarations
      const ret = {}
      for (const key in input) {
        ret[key] = rem2px(input[key], fontSize)
      }
      return ret
    case "string":
      return input.replace(/(\d*\.?\d+)rem$/, (_, val) => `${parseFloat(val) * fontSize}px`)
    case "function":
      return eval(
        input.toString().replace(/(\d*\.?\d+)rem/g, (_, val) => `${parseFloat(val) * fontSize}px`)
      )
    default:
      return input
  }
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    ...rem2px(defaultTheme),
    colors: {
      transparent: "transparent",
      current: "currentColor",
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
      danger: {
        // button background
        100: "rgb(var(--color-danger-100) / <alpha-value>)", // default
        200: "rgb(var(--color-danger-200) / <alpha-value>)", // hover
      },
      "danger-content": {
        // button foreground
        100: "rgb(var(--color-danger-content-100) / <alpha-value>)", // default
        200: "rgb(var(--color-danger-content-200) / <alpha-value>)", // hover
      },
      success: {
        // button background
        100: "rgb(var(--color-success-100) / <alpha-value>)", // default
        200: "rgb(var(--color-success-200) / <alpha-value>)", // hover
      },
      "success-content": {
        // button foreground
        100: "rgb(var(--color-success-content-100) / <alpha-value>)", // default
        200: "rgb(var(--color-success-content-200) / <alpha-value>)", // hover
      },
    },
  },
  plugins: [],
}
