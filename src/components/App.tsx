import MenuPanel from "./MenuPanel"
import cssText from "../base.css?inline"
import { useSnippets } from "../store/snippets"
import { useEffect, useState } from "react"
import EnhanceInput from "./EnhanceInput"
import SnippetsPopup from "./SnippetsPopup"
import { useDarkMode } from "../hooks/useDarkMode"

export default function App() {
  const isDarkMode = useDarkMode()
  const [inited, setInited] = useState(false)
  const init = useSnippets((state) => state.init)
  useEffect(() => {
    init()
      .then(() => setInited(true))
      .catch((err) => {
        // TODO init failed
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!inited) return null
  return (
    <div className={isDarkMode ? "dark" : "light"}>
      <style>{cssText}</style>
      <MenuPanel></MenuPanel>
      <SnippetsPopup></SnippetsPopup>
      <EnhanceInput></EnhanceInput>
    </div>
  )
}
