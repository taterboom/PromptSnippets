import { createRoot } from "react-dom/client"
import App from "./components/App"
import { ROOT_ID } from "./constants"

const rootEl = document.createElement("div")
rootEl.id = ROOT_ID
const shadowRoot = rootEl.attachShadow({ mode: "open" })
document.body.appendChild(rootEl)

createRoot(shadowRoot).render(<App />)
