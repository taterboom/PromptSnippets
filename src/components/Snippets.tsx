import clsx from "classnames"
import { AnimatePresence } from "framer-motion"
import Fuse from "fuse.js"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { usePageState } from "../store/pageState"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { Snippet } from "../types"
import SnippetsDeleter from "./SnippetDeleter"
import SnippetEditor from "./SnippetEditor"
import Expandable from "./UI/Expandable"
import HighlightText from "./UI/HighlightText"
import KBD from "./UI/KBD"
import { MiDelete, MiEdit, TablerMoodEmptyFilled } from "./UI/icons"
import Tags from "./Tags"

function SnippetCard(props: { data: Snippet; matches?: readonly Fuse.FuseResultMatch[] }) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const selectedTags = usePageState((state) => state.selectedTags)

  const active = editing || deleting

  return (
    <>
      <div
        className={clsx("group py-3 px-4 hover:bg-base-300 space-y-[3px]", active && "bg-base-300")}
      >
        <div className="flex gap-2 overflow-hidden">
          <div className="text-sm flex-1 text-left leading-[18px]">
            <HighlightText
              className="mr-1.5"
              text={props.data.name}
              positions={props.matches?.filter((match) => match.key === "name")?.[0]?.indices || []}
            ></HighlightText>
            <Tags tags={props.data.tags} selectedTags={selectedTags} />
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
        <Expandable className="text-xs text-content-300 transition-all mt-px">
          <HighlightText
            text={props.data.content}
            positions={
              props.matches?.filter((match) => match.key === "content")?.[0]?.indices || []
            }
          ></HighlightText>
        </Expandable>
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
      <div className="text-xs text-content-300 space-y-1">
        <div className="text-sm">
          You haven't created any snippets yet. <TablerMoodEmptyFilled className="inline ml-0.5" />
        </div>
        <div>
          <button className="underline" onClick={props.onCreate}>
            Get started now
          </button>{" "}
          to enhance your browsing experience!
        </div>
        <div className="text-content-300">
          You can type <KBD>/</KBD> in any input box to open the popup and select the snippet in it.
        </div>
        {/* <div>
            If you don't want to use the popup, you can use the shortcut <KBD>Command</KBD>/
            <KBD>Alt</KBD> + <KBD>Shift</KBD> + <KBD>P</KBD> to toggle PromptSnippets in this page.
          </div> */}
      </div>
    </div>
  )
}

export default function Snippets(props: { onCreate: () => void }) {
  const snippets = useSnippets(snippetsSelectors.snippets)
  const searchText = usePageState((state) => state.searchText)
  const selectedTags = usePageState((state) => state.selectedTags)
  const tags = useSnippets(snippetsSelectors.tags)
  const validSelectedTags = useMemo(
    () => selectedTags.filter((t) => tags.includes(t)),
    [selectedTags, tags]
  )
  const candidateSnippets = useMemo(
    () =>
      validSelectedTags.length > 0
        ? snippets.filter((item) => validSelectedTags.some((t) => item.tags?.includes(t)))
        : snippets,
    [validSelectedTags, snippets]
  )
  const fuseInstance = useMemo(() => {
    return new Fuse<Snippet>(candidateSnippets, {
      includeMatches: true,
      keys: ["name", { name: "content", weight: 0.5 }],
    })
  }, [candidateSnippets])
  const searchedSnippets = useMemo(() => {
    return searchText
      ? fuseInstance.search(searchText)
      : (candidateSnippets.map((item) => ({ item })) as ReturnType<
          typeof fuseInstance.search<Snippet>
        >)
  }, [fuseInstance, candidateSnippets, searchText])

  return (
    <div className="divide-y divide-base-300">
      {snippets.length === 0 ? (
        <NoSnippets onCreate={props.onCreate}></NoSnippets>
      ) : searchedSnippets.length > 0 ? (
        searchedSnippets.map((candidateSnippet) => {
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
