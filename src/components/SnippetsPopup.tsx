import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "classnames"
import { motion, AnimatePresence } from "framer-motion"
import { usePageState } from "../store/pageState"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { awesomeSetSelectionRange, selectNextRange, setInputValue } from "../utils/range"
import KBD from "./UI/KBD"
import Fuse from "fuse.js"
import { Snippet } from "../types"
import { MiArrowDown, MiArrowUp, MiEnter } from "./UI/icons"

function NoSnippets() {
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
      <button
        className="btn btn-primary"
        onClick={() => {
          usePageState.setState({ menuPanelVisible: true })
        }}
      >
        Go to create a prompt snippet
      </button>
    </div>
  )
}

function HighlightText(props: { text: string; positions: ReadonlyArray<[number, number]> }) {
  const { text, positions } = props
  const chunks = useMemo(() => {
    const result: { highlight: boolean; data: string }[] = []
    let lastPosition = 0
    positions.forEach((position) => {
      const [start, end] = position
      result.push({ highlight: false, data: text.slice(lastPosition, start) })
      // the end position is inclusive in fuse matches indices
      result.push({ highlight: true, data: text.slice(start, end + 1) })
      lastPosition = end + 1
    })
    result.push({ highlight: false, data: text.slice(lastPosition) })
    return result.filter((item) => !!item.data)
  }, [text, positions])
  return (
    <>
      {chunks.map((chunk, index) => (
        <span key={index} className={chunk.highlight ? "text-primary-200" : ""}>
          {chunk.data}
        </span>
      ))}
    </>
  )
}

function Container(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={clsx(
        "popup-shadow min-w-[240px] max-w-[300px] max-h-[240px] bg-base-100 text-content-100 border border-neutral-200 rounded overflow-hidden",
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

function Footer() {
  return (
    <div className="flex justify-between items-center border-t border-neutral-100 py-1.5 px-3 text-xs opacity-70">
      <div className="space-x-2">
        <span className="inline-flex items-center gap-1">
          <KBD className="!h-4 !px-[3px] text-xs">
            <MiArrowUp />
          </KBD>
          <KBD className="!h-4 !px-[3px] text-xs -ml-0.5">
            <MiArrowDown />
          </KBD>{" "}
          navigate
        </span>
        <span className="inline-flex items-center gap-1">
          <KBD className="!h-4 !px-[3px] text-xs">
            <MiEnter />
          </KBD>
          select
        </span>
      </div>
      <div>Logo</div>
    </div>
  )
}

// " /sometext " => "sometext "
const formatSearchText = (text: string) => text.trimStart().slice(1)

function SnippetsPicker() {
  const snippets = useSnippets(snippetsSelectors.snippets)
  const target = usePageState((state) => state.currentInput)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  const [text, setText] = useState<string | null>(target ? formatSearchText(target.value) : null)
  const fuseInstance = useMemo(() => {
    return new Fuse<Snippet>(snippets, {
      includeMatches: true,
      keys: ["name", { name: "content", weight: 0.5 }],
    })
  }, [snippets])
  const candidateSnippets = useMemo(() => {
    return text
      ? fuseInstance.search(text)
      : (snippets.map((item) => ({ item })) as ReturnType<typeof fuseInstance.search<Snippet>>)
  }, [fuseInstance, snippets, text])
  const activeCandidateSnippet = useMemo(() => {
    return candidateSnippets.find((item) => item.item.id === activeId)
  }, [candidateSnippets, activeId])
  const applySnippetRef = useRef<() => void>()
  applySnippetRef.current = () => {
    const snippet = snippets.find((item) => item.id === activeIdRef.current)
    if (snippet && target) {
      setInputValue(target, snippet.content)
      if (!selectNextRange(target)) {
        awesomeSetSelectionRange(target, 0, 0)
      }
    }
  }
  useEffect(() => {
    if (!target) {
      setText(null)
      return
    }
    const onChange = (e: any) => {
      setText(e.target.value ? formatSearchText(e.target.value) : null)
    }
    target.addEventListener("input", onChange)
    target.addEventListener("change", onChange)
    return () => {
      target.removeEventListener("input", onChange)
      target.removeEventListener("change", onChange)
    }
  }, [target])
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveId((activeId) => {
          const activeIndex = snippets.findIndex((item) => item.id === activeId)
          const nextIndex = activeIndex < snippets.length - 1 ? activeIndex + 1 : 0
          return snippets[nextIndex].id
        })
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveId((activeId) => {
          const activeIndex = snippets.findIndex((item) => item.id === activeId)
          const nextIndex = activeIndex > 0 ? activeIndex - 1 : snippets.length - 1
          return snippets[nextIndex].id
        })
      }
      if (e.key === "Enter") {
        e.preventDefault()
        applySnippetRef.current?.()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [snippets, target])
  useEffect(() => {
    if (candidateSnippets[0]?.matches) {
      setActiveId(candidateSnippets[0]?.item.id)
    } else {
      setActiveId(null)
    }
  }, [candidateSnippets])

  console.log(candidateSnippets)

  return (
    <>
      {candidateSnippets.length === 0 ? (
        <Container className="px-4 py-2 text-sm">
          <div>No results for "{text}"</div>
          <button
            className="underline text-primary-100 hover:text-primary-200"
            onClick={() => {
              usePageState.setState({ menuPanelVisible: true })
            }}
          >
            Go to create it
          </button>
        </Container>
      ) : (
        <div className="relative">
          <Container>
            <>
              <div className="p-1">
                {candidateSnippets.map(({ item, matches }) => (
                  <div
                    key={item.id}
                    className={clsx(
                      "px-3 py-1 text-sm text-content-300 rounded",
                      item.id === activeId && "!bg-base-400 !text-content-100"
                    )}
                    onMouseOver={() => setActiveId(item.id)}
                    onClick={() => {
                      applySnippetRef.current?.()
                    }}
                  >
                    <HighlightText
                      text={item.name}
                      positions={
                        matches?.filter((match) => match.key === "name")?.[0]?.indices || []
                      }
                    ></HighlightText>
                  </div>
                ))}
              </div>
              <Footer />
            </>
          </Container>
          <AnimatePresence>
            {!!activeCandidateSnippet && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute -right-1.5 top-0 translate-x-full"
              >
                <Container>
                  <div className="px-4 py-2 text-content-300">
                    <div className="text-sm">
                      <HighlightText
                        text={activeCandidateSnippet.item.name}
                        positions={
                          activeCandidateSnippet.matches?.filter(
                            (match) => match.key === "name"
                          )?.[0]?.indices || []
                        }
                      ></HighlightText>
                    </div>
                    <div className="text-xs mt-1">
                      <HighlightText
                        text={activeCandidateSnippet.item.content}
                        positions={
                          activeCandidateSnippet.matches?.filter(
                            (match) => match.key === "content"
                          )?.[0]?.indices || []
                        }
                      ></HighlightText>
                    </div>
                  </div>
                </Container>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  )
}

function SnippetsPopupInner() {
  const snippets = useSnippets(snippetsSelectors.snippets)
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const target = usePageState((state) => state.currentInput)

  useEffect(() => {
    const rootEl = rootRef.current
    const contentEl = contentRef.current
    const setPosition = () => {
      if (!rootEl || !contentEl || !target) return
      const targetRect = target.getBoundingClientRect()
      const top = targetRect.top
      const bottom = window.innerHeight - targetRect.bottom
      if (top < 240 + 16 && bottom > 240) {
        rootEl.style.left = targetRect.left + "px"
        rootEl.style.top = targetRect.bottom + "px"
        contentEl.style.top = "8px"
        contentEl.style.bottom = "initial"
      } else {
        rootEl.style.left = targetRect.left + "px"
        rootEl.style.top = targetRect.top + "px"
        contentEl.style.bottom = "8px"
        contentEl.style.top = "initial"
      }
    }
    setPosition()
    window.addEventListener("resize", setPosition)
    window.addEventListener("scroll", setPosition)
    return () => {
      window.removeEventListener("resize", setPosition)
      window.removeEventListener("scroll", setPosition)
    }
  }, [target])

  return (
    <div ref={rootRef} className="fixed z-[100000]">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.1 }}
        className="absolute left-0 z-[100000]"
        ref={contentRef}
      >
        {snippets.length > 0 ? <SnippetsPicker></SnippetsPicker> : <NoSnippets></NoSnippets>}
      </motion.div>
    </div>
  )
}

export default function SnippetsPopup() {
  const disabled = usePageState((state) => state.disabled)
  const target = usePageState((state) => state.currentInput)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!target) {
      setVisible(false)
      return
    }
    const onChange = (e: any) => {
      setVisible(e.target?.value?.startsWith?.("/") ?? false)
    }
    onChange(target.value)
    target.addEventListener("input", onChange)
    target.addEventListener("change", onChange)
    return () => {
      target.removeEventListener("input", onChange)
      target.removeEventListener("change", onChange)
    }
  }, [target])

  return (
    <AnimatePresence>
      {visible && !disabled && <SnippetsPopupInner></SnippetsPopupInner>}
    </AnimatePresence>
  )
}
