import { useState } from "react"
import { motion } from "framer-motion"
import { useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"

type SnippetEditorProps = {
  id?: string
  onClose?: () => void
}

export default function SnippetEditor(props: SnippetEditorProps) {
  const currentSnippet = useSnippets((state) => (props.id ? state.snippetsStore[props.id] : null))
  const addSnippet = useSnippets((state) => state.addSnippet)
  const updateSnippet = useSnippets((state) => state.updateSnippet)
  const [content, setContent] = useState(currentSnippet?.content || "")
  const [name, setName] = useState(currentSnippet?.name || "")

  return (
    <PopupContainer onClick={props.onClose}>
      <input
        placeholder="Command"
        type="text"
        className="block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
      />
      <textarea
        className="block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
        placeholder="Content"
        cols={36}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-end gap-2 items-center">
        <button className="btn" onClick={props.onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const snippet = { name: name, content: content }
            if (currentSnippet) {
              updateSnippet({ ...currentSnippet, ...snippet })
            } else {
              addSnippet(snippet)
            }
            props.onClose?.()
          }}
        >
          Save
        </button>
      </div>
    </PopupContainer>
  )
}
