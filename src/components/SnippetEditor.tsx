import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"
import { usePageState } from "../store/pageState"
import { Tooltip, TooltipContent, TooltipTrigger } from "./UI/Tooltip"
import { MiCircleHelp } from "./UI/icons"
import { VARIABLE_DEFAULT_VALUE_SEPARATOR } from "../constants"

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
  const [prefix, setPrefix] = useState(currentSnippet?.prefix || "")
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
          tabIndex={1}
          placeholder="e.g. Summarize"
          type="text"
          className="text-sm !mt-1.5 block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          value={prefix}
          onChange={(e) => {
            setPrefix(e.target.value)
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
              {`The snippet content. Use ${wrapper[0]}variable${wrapper[1]} to define a variable, or use ${wrapper[0]}variable${VARIABLE_DEFAULT_VALUE_SEPARATOR}defaultValue${wrapper[1]} to define variable and it's default value.`}
            </TooltipContent>
          </Tooltip>
        </div>
        <textarea
          tabIndex={2}
          className="text-sm !mt-1.5 block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          placeholder={`e.g. Summarize the text in ${wrapper[0]}count${VARIABLE_DEFAULT_VALUE_SEPARATOR}10${wrapper[1]} words: ${wrapper[0]}text${wrapper[1]}`}
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
          tabIndex={3}
          className="btn btn-primary"
          onClick={() => {
            if (!(prefix && content)) {
              alert('Please fill in "Prefix" and "Content"')
              return
            }
            const snippet = { prefix, content }
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
