import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    outDir: "dist-web",
    // assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        playground: "./src/playground.tsx",
      },
    },
  },
  plugins: [react()],
})
