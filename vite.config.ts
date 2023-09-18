import { crx } from "@crxjs/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import manifest from "./manifest.json"

export default defineConfig({
  // build: {
  //   // assetsInlineLimit: 0,
  //   rollupOptions: {
  //     input: {
  //       contentScript: "./src/contentScript.tsx",
  //     },
  //   },
  // },
  plugins: [react(), crx({ manifest })],
  test: {
    environment: "happy-dom",
  },
})
