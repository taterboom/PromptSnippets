import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SnippetEditor from "./SnippetEditor"
import Snippets from "./Snippets"
import { usePageState } from "../store/pageState"
import { MiAdd, MiClose, MiSettings } from "./UI/icons"
import SettingsPanel from "./SettingsPanel"

function Header(props: { onCreate?: () => void }) {
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>Logo</div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              usePageState.setState({ settingsPanelVisible: true })
            }}
          >
            <MiSettings />
          </button>
          <button
            className="btn btn-icon"
            onClick={() => {
              usePageState.setState({ menuPanelVisible: false })
            }}
          >
            <MiClose />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <button className="btn btn-primary !px-2 !h-6" onClick={props.onCreate}>
          <MiAdd className="mr-1" /> Create
        </button>
      </div>
    </div>
  )
}

export default function MenuPanel() {
  const menuPanelVisible = usePageState((state) => state.menuPanelVisible)
  const settingsPanelVisible = usePageState((state) => state.settingsPanelVisible)
  const [snippetEditorVisible, setSnippetEditorVisible] = useState(false)
  return (
    <AnimatePresence>
      {menuPanelVisible && (
        <motion.div
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.12 }}
          // `will-change` is required to act as containing block for the fixed-position children such as popups
          className="will-change-transform fixed top-0 right-0 bottom-0 w-96 bg-base-100 shadow-lg z-[100000]"
        >
          <Header onCreate={() => setSnippetEditorVisible(true)}></Header>
          <div className="mt-2">
            <Snippets onCreate={() => setSnippetEditorVisible(true)}></Snippets>
          </div>
          <AnimatePresence>
            {snippetEditorVisible && (
              <SnippetEditor
                onClose={() => {
                  setSnippetEditorVisible(false)
                }}
              ></SnippetEditor>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {settingsPanelVisible && (
              <SettingsPanel
                onClose={() => {
                  usePageState.setState({ settingsPanelVisible: false })
                }}
              ></SettingsPanel>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
