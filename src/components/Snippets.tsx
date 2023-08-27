import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { Snippet } from "../types"
import clsx from "classnames"
import { AnimatePresence, motion } from "framer-motion"
import { MiDelete, MiEdit } from "./UI/icons"
import SnippetEditor from "./SnippetEditor"
import SnippetsDeleter from "./SnippetDeleter"

function useIsFirstMount() {
  const isFirst = useRef(true)
  if (isFirst.current) {
    isFirst.current = false
    return true
  }
  return isFirst.current
}

function SnippetCard(props: { data: Snippet }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isFirst = useIsFirstMount()
  const [expanded, setExpanded] = useState(true)
  const elRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef(0)

  useLayoutEffect(() => {
    heightRef.current = elRef.current!.clientHeight
    setExpanded(false)
  }, [])

  const active = editing || deleting
  const canZoom = heightRef.current > 20

  return (
    <>
      <div
        className={clsx("group py-3 px-4 hover:bg-base-300 space-y-[3px]", active && "bg-base-300")}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="text-sm flex-1 truncate">{props.data.name}</div>
          <div
            className={clsx(
              "flex-shrink-0 flex gap-2 invisible group-hover:visible",
              active && "!visible"
            )}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <button
              className="btn btn-sm btn-icon btn-ghost !text-danger-100"
              onClick={() => {
                setDeleting(true)
              }}
            >
              <MiDelete />
            </button>
            <button
              className="btn btn-sm btn-icon"
              onClick={() => {
                setEditing(true)
              }}
            >
              <MiEdit />
            </button>
          </div>
        </div>
        <div
          className={clsx(
            "text-xs text-content-300 transition-all",
            !expanded && "truncate",
            canZoom ? (expanded ? "cursor-zoom-out" : "cursor-zoom-in") : "cursor-default"
          )}
          ref={elRef}
          style={{ height: isFirst ? "auto" : expanded ? heightRef.current : 16 }}
        >
          {props.data.content}
        </div>
      </div>
      <AnimatePresence>
        {editing && (
          <SnippetEditor
            id={props.data.id}
            onClose={() => {
              setEditing(false)
            }}
          ></SnippetEditor>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleting && (
          <SnippetsDeleter
            id={props.data.id}
            onClose={() => {
              setDeleting(false)
            }}
          ></SnippetsDeleter>
        )}
      </AnimatePresence>
    </>
  )
}

export default function Snippets() {
  const snippets = useSnippets(snippetsSelectors.snippets)
  return (
    <div className="divide-y divide-base-400">
      {snippets.map((snippet: any) => {
        return <SnippetCard key={snippet.id} data={snippet}></SnippetCard>
      })}
    </div>
  )
}
