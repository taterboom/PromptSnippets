import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { Snippet } from "../types"
import clsx from "classnames"
import { AnimatePresence, motion } from "framer-motion"
import { MiDelete, MiEdit } from "./UI/icons"
import SnippetEditor from "./SnippetEditor"
import SnippetsDeleter from "./SnippetDeleter"
import KBD from "./UI/KBD"
import Fuse from "fuse.js"
import { usePageState } from "../store/pageState"
import HighlightText from "./UI/HighlightText"

function useIsFirstMount() {
  const isFirst = useRef(true)
  if (isFirst.current) {
    isFirst.current = false
    return true
  }
  return isFirst.current
}

function SnippetCard(props: { data: Snippet; matches?: readonly Fuse.FuseResultMatch[] }) {
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
          <div className="text-sm flex-1 truncate">
            <HighlightText
              text={props.data.name}
              positions={props.matches?.filter((match) => match.key === "name")?.[0]?.indices || []}
            ></HighlightText>
          </div>
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
          <HighlightText
            text={props.data.content}
            positions={
              props.matches?.filter((match) => match.key === "content")?.[0]?.indices || []
            }
          ></HighlightText>
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

function NoSnippets(props: { onCreate: () => void }) {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-content-100">
        <div>Logo</div>
        <div>PromptSnippets</div>
      </div>
      <div className="text-xs text-content-300 space-y-1">
        <div>Click Popup action to manage your prompt snippets</div>
        <div>
          Shortcut <KBD>Command</KBD>/<KBD>Alt</KBD> + <KBD>Shift</KBD> + <KBD>P</KBD> to toggle
          PromptSnippets in this page
        </div>
        <div>
          Type <KBD>/</KBD> to open the popup
        </div>
      </div>
      <button className="btn btn-primary" onClick={props.onCreate}>
        Create a prompt snippet
      </button>
    </div>
  )
}

export default function Snippets(props: { onCreate: () => void }) {
  const snippets = useSnippets(snippetsSelectors.snippets)
  const searchText = usePageState((state) => state.searchText)
  const fuseInstance = useMemo(() => {
    return new Fuse<Snippet>(snippets, {
      includeMatches: true,
      keys: ["name", { name: "content", weight: 0.5 }],
    })
  }, [snippets])
  const candidateSnippets = useMemo(() => {
    return searchText
      ? fuseInstance.search(searchText)
      : (snippets.map((item) => ({ item })) as ReturnType<typeof fuseInstance.search<Snippet>>)
  }, [fuseInstance, snippets, searchText])

  return (
    <div className="divide-y divide-base-400">
      {snippets.length === 0 ? (
        <NoSnippets onCreate={props.onCreate}></NoSnippets>
      ) : candidateSnippets.length > 0 ? (
        candidateSnippets.map((candidateSnippet) => {
          return (
            <SnippetCard
              key={candidateSnippet.item.id}
              data={candidateSnippet.item}
              matches={candidateSnippet.matches}
            ></SnippetCard>
          )
        })
      ) : (
        <div className="p-4">No results for "{searchText}"</div>
      )}
    </div>
  )
}
