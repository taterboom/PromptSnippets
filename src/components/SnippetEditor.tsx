import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"
import { usePageState } from "../store/pageState"
import { Tooltip, TooltipContent, TooltipTrigger } from "./UI/Tooltip"
import { MiCircleHelp } from "./UI/icons"

type SnippetEditorProps = {
  id?: string
  onClose?: () => void
}

export default function SnippetEditor(props: SnippetEditorProps) {
  const triggerSymbol = usePageState((state) => state.triggerSymbol)
  const wrapperSymbol = usePageState((state) => state.wrapperSymbol)
  const currentSnippet = useSnippets((state) => (props.id ? state.snippetsStore[props.id] : null))
  const addSnippet = useSnippets((state) => state.addSnippet)
  const updateSnippet = useSnippets((state) => state.updateSnippet)
  const [content, setContent] = useState(currentSnippet?.content || "")
  const [name, setName] = useState(currentSnippet?.name || "")
  const wrapper = useMemo(() => wrapperSymbol[0]?.split?.(/\s+/) ?? ["", ""], [wrapperSymbol])

  return (
    <PopupContainer onClick={props.onClose}>
      <div className="space-y-1">
        <div className="text-sm text-content-100 flex items-center gap-1">
          <span>Prefix</span>
          <Tooltip placement="top-start">
            <TooltipTrigger className="p-0.5">
              <MiCircleHelp className="text-xs text-content-400" />
            </TooltipTrigger>
            <TooltipContent className="text-xs text-content-200 w-60 z-[1000000] bg-base-100/10 backdrop-blur border border-neutral-200 p-2 rounded menu-popup-shadow">{`The prefix to be used when selecting the snippet in the snippets popup after typing "${
              triggerSymbol[0] ?? ""
            }prefix".`}</TooltipContent>
          </Tooltip>
        </div>
        <input
          placeholder="e.g. translate"
          type="text"
          className="text-sm !mt-1.5 block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>
      <div className="space-y-1">
        <div className="text-sm text-content-100 flex items-center gap-1">
          <span>Content</span>
          <Tooltip placement="top-start">
            <TooltipTrigger className="p-0.5">
              <MiCircleHelp className="text-xs text-content-400" />
            </TooltipTrigger>
            <TooltipContent className="text-xs text-content-200 w-60 z-[1000000] bg-base-100/10 backdrop-blur border border-neutral-200 p-2 rounded menu-popup-shadow">
              {`The snippet content. wrap variable values with ${wrapper[0]}VariableName${wrapper[1]}`}
            </TooltipContent>
          </Tooltip>
        </div>
        <textarea
          className="text-sm !mt-1.5 block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          placeholder={`e.g. Translate the text to ${wrapper[0]}language${wrapper[1]}: ${wrapper[0]}text${wrapper[1]}`}
          cols={36}
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
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
