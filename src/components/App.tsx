import cssText from "../base.css?inline"
import { useDarkMode } from "../hooks/useDarkMode"
import { useInit } from "../hooks/useInit"
import EnhanceInput from "./EnhanceInput"
import MenuPanel from "./MenuPanel"
import SnippetsPopup from "./SnippetsPopup"

export default function App() {
  const isDarkMode = useDarkMode()
  const ready = useInit()
  if (!ready) return null
  return (
    <div
      className={isDarkMode ? "dark" : "light"}
      style={{
        fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      }}
    >
      <style>{cssText}</style>
      <MenuPanel></MenuPanel>
      <SnippetsPopup></SnippetsPopup>
      <EnhanceInput></EnhanceInput>
    </div>
  )
}
