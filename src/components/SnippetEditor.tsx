import { useState } from "react"
import { motion } from "framer-motion"
import { useSnippets } from "../store/snippets"

type SnippetEditorProps = {
  id?: string
  onCancel: () => void
}

export default function SnippetEditor(props: SnippetEditorProps) {
  const currentSnippet = useSnippets((state) => (props.id ? state.snippetsStore[props.id] : null))
  const addSnippet = useSnippets((state) => state.addSnippet)
  const updateSnippet = useSnippets((state) => state.updateSnippet)
  const [text, setText] = useState(currentSnippet?.content || "")

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.05 }}
        className="menu-popup-shadow p-3 rounded border border-neutral-200 bg-base-100 space-y-2"
      >
        <div>
          <textarea
            className="bg-base-200 text-content-200 border border-neutral-200 rounded w-full p-2 focus:border-primary-100 focus-visible:outline-none"
            name=""
            id=""
            cols={36}
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end gap-2 items-center">
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const snippet = { name: "new snippet", content: text }
              if (currentSnippet) {
                updateSnippet({ ...currentSnippet, ...snippet })
              } else {
                addSnippet(snippet)
              }
            }}
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  )
}
