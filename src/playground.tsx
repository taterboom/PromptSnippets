import cssText from "./base.css?inline"
import { useDarkMode } from "./hooks/useDarkMode"
import EnhanceInput from "./components/EnhanceInput"
import MenuPanel from "./components/MenuPanel"
import SnippetsPopup from "./components/SnippetsPopup"
import { useSnippets } from "./store/snippets"
import {
  DEFAULT_SNIPPET_DEMO_1,
  DEFAULT_SNIPPET_DEMO_2,
  DEFAULT_SNIPPET_DEMO_3,
  DEFAULT_SNIPPET_GUIDE,
} from "./constants"
import { usePageState } from "./store/pageState"
import { createRoot } from "react-dom/client"
import { ROOT_ID } from "./constants"

useSnippets.setState({
  ids: [
    DEFAULT_SNIPPET_GUIDE.id,
    DEFAULT_SNIPPET_DEMO_3.id,
    DEFAULT_SNIPPET_DEMO_1.id,
    DEFAULT_SNIPPET_DEMO_2.id,
  ],
  snippetsStore: {
    [DEFAULT_SNIPPET_GUIDE.id]: DEFAULT_SNIPPET_GUIDE,
    [DEFAULT_SNIPPET_DEMO_1.id]: DEFAULT_SNIPPET_DEMO_1,
    [DEFAULT_SNIPPET_DEMO_2.id]: DEFAULT_SNIPPET_DEMO_2,
    [DEFAULT_SNIPPET_DEMO_3.id]: DEFAULT_SNIPPET_DEMO_3,
  },
})
usePageState.setState({ disabled: false })

window.chrome = {
  ...window?.chrome,
  runtime: {
    ...window?.chrome?.runtime,
    getURL: (url: string) => url,
    sendMessage: (...args: any[]) => Promise.resolve(),
  },
}

function App() {
  const isDarkMode = useDarkMode()
  return (
    <div
      className={isDarkMode ? "dark" : "light"}
      style={{
        fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      }}
    >
      <style>{cssText}</style>
      {/* <MenuPanel></MenuPanel> */}
      <SnippetsPopup></SnippetsPopup>
      <EnhanceInput></EnhanceInput>
    </div>
  )
}

const rootEl = document.createElement("div")
rootEl.id = ROOT_ID
const shadowRoot = rootEl.attachShadow({ mode: "open" })
document.body.appendChild(rootEl)

createRoot(shadowRoot).render(<App />)
