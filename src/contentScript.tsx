import { createRoot } from "react-dom/client"
import App from "./components/App"
import { ROOT_ID } from "./constants"

const rootEl = document.createElement("promptsnippets-slider")
rootEl.id = ROOT_ID
const shadowRoot = rootEl.attachShadow({ mode: "open" })
document.documentElement.appendChild(rootEl)

createRoot(shadowRoot).render(<App />)
