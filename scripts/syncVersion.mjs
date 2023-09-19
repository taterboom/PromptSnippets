import pkg from "../package.json" assert { type: "json" }
import fs from "node:fs/promises"

const manifestStr = await fs.readFile("./manifest.json", "utf8")
fs.writeFile(
  "./manifest.json",
  manifestStr.replace(/"version": ".*"/, `"version": "${pkg.version}"`)
)
