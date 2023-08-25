import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SnippetEditor from "./SnippetEditor"
import Snippets from "./Snippets"

function Header(props: { onNew?: () => void }) {
  return (
    <div className="flex justify-between py-2 px-3">
      <div>Logo</div>
      <div className="flex items-center gap-2">
        <button className="btn btn-primary" onClick={props.onNew}>
          new
        </button>
        <button className="btn">close</button>
      </div>
    </div>
  )
}

export default function MenuPanel() {
  const [snippetEditorVisible, setSnippetEditorVisible] = useState(false)
  return (
    <motion.div
      initial={{ x: 8, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      // `will-change` is required to act as containing block for the fixed-position children
      className="will-change-transform fixed top-0 right-0 bottom-0 w-96 bg-base-100 shadow-lg z-[100000]"
    >
      <Header onNew={() => setSnippetEditorVisible(true)}></Header>
      <Snippets></Snippets>
      <AnimatePresence>
        {snippetEditorVisible && (
          <SnippetEditor
            onCancel={() => {
              setSnippetEditorVisible(false)
            }}
          ></SnippetEditor>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
