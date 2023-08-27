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
    <div className={isDarkMode ? "dark" : "light"}>
      <style>{cssText}</style>
      <MenuPanel></MenuPanel>
      <SnippetsPopup></SnippetsPopup>
      <EnhanceInput></EnhanceInput>
    </div>
  )
}
