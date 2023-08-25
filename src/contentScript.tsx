import { createRoot } from "react-dom/client"
import App from "./components/App"
import { ROOT_ID } from "./constants"

console.log("contentScript11")

const rootEl = document.createElement("div")
rootEl.id = ROOT_ID
const shadowRoot = rootEl.attachShadow({ mode: "open" })
document.body.appendChild(rootEl)

createRoot(shadowRoot).render(<App />)

/**
 * 增强的input功能：
 * - tab填充{{}}变量
 * - "/"呼出snippets面板
 */

/**
 * 如何开启input增强？
 * - 通过快捷键开启
 * - 开启后注入content_script如果没有注入的话
 * - 只增强当前active的input
 * - 可关闭
 */
