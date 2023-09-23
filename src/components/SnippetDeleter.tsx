import { useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"

export default function SnippetsDeleter(props: { id: string; onClose: () => void }) {
  const removeSnippets = useSnippets((state) => state.removeSnippets)
  const snippet = useSnippets((state) => state.snippetsStore[props.id])
  if (!snippet) return null
  return (
    <PopupContainer onClick={props.onClose}>
      <div className="text-base">
        Are you sure you want to delete <span className="font-semibold">{snippet.name}</span>?
      </div>
      <div className="flex justify-end gap-2 items-center">
        <button className="btn" onClick={props.onClose}>
          Cancel
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            removeSnippets([props.id])
            props.onClose?.()
          }}
        >
          Delete
        </button>
      </div>
    </PopupContainer>
  )
}
