import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SnippetEditor from "./SnippetEditor"
import Snippets from "./Snippets"
import { usePageState } from "../store/pageState"
import { MiAdd, MiClose } from "./UI/icons"

function Header(props: { onNew?: () => void }) {
  const disabled = usePageState((state) => state.disabled)
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>Logo</div>
        <div className="flex items-center gap-2">
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
        <button className="btn btn-primary !px-2 !h-6" onClick={props.onNew}>
          <MiAdd className="mr-1" /> Create
        </button>
        <label className="group inline-flex items-center gap-1">
          <span className="text-xs text-content-400 opacity-70 scale-90 origin-right group-hover:opacity-100">
            Enable on current page
          </span>
          <input
            type="checkbox"
            className="checkbox"
            checked={!disabled}
            onChange={(e) => {
              usePageState.setState({ disabled: !e.target.checked })
            }}
          ></input>
        </label>
      </div>
    </div>
  )
}

export default function MenuPanel() {
  const menuPanelVisible = usePageState((state) => state.menuPanelVisible)
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
          <Header onNew={() => setSnippetEditorVisible(true)}></Header>
          <div className="mt-2">
            <Snippets></Snippets>
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}
