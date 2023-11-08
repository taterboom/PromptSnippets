import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "classnames"
import { motion, AnimatePresence } from "framer-motion"
import { pageStateSelectors, usePageState } from "../store/pageState"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import {
  awesomeSetSelectionRange,
  getInputValue,
  selectNextRange,
  setChangeListener,
  setInputValue,
} from "../utils/dom"
import KBD from "./UI/KBD"
import Fuse from "fuse.js"
import { Snippet } from "../types"
import {
  MiArrowDown,
  MiArrowUp,
  MiClose,
  MiEnter,
  TablerMoodEmptyFilled,
  TablerPower,
} from "./UI/icons"
import HighlightText from "./UI/HighlightText"
import { ROOT_ID } from "../constants"
import { throttle } from "lodash"
import { InputPopup } from "./InputPopup"
import { useIsUnmount } from "../hooks/useIsUnmount"
import { getVariables } from "../utils/snippet"
import { Tooltip, TooltipContent, TooltipTrigger } from "./UI/Tooltip"
import Tags from "./Tags"

function NoSnippets() {
  return (
    <Container>
      <div className="p-4 space-y-2">
        <div
          className="flex items-center gap-2 text-sm font-medium text-content-100"
          onClick={() => {
            usePageState.setState({ menuPanelVisible: true })
          }}
        >
          <div>
            <img src={chrome.runtime.getURL("logo-128.png")} width={24} height={24} alt="" />
          </div>
          <div>PromptSnippets</div>
        </div>
        <div className="text-xs text-content-300 space-y-1">
          <div className="text-sm">
            You haven't created any snippets yet.{" "}
            <TablerMoodEmptyFilled className="inline ml-0.5" />
          </div>
          <div>
            <button
              className="underline"
              onClick={() => {
                usePageState.setState({ menuPanelVisible: true })
              }}
            >
              Get started now
            </button>{" "}
            to enhance your browsing experience!
          </div>
          <div className="text-content-300">
            You can type <KBD>/</KBD> in any input box to open the popup and select the snippet in
            it.
          </div>
          {/* <div>
            If you don't want to use the popup, you can use the shortcut <KBD>Command</KBD>/
            <KBD>Alt</KBD> + <KBD>Shift</KBD> + <KBD>P</KBD> to toggle PromptSnippets in this page.
          </div> */}
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
    </Container>
  )
}

function Container(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  return (
    <div
      {...props}
      className={clsx(
        "popup-shadow min-w-[240px] max-w-[300px] max-h-[240px] w-max bg-base-100 text-content-100 border border-neutral-200 rounded overflow-hidden",
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

function Footer(props: { hover: boolean; onClose: () => void }) {
  return (
    <div className="relative flex justify-between items-center border-t border-neutral-100 py-1.5 px-3 text-xs opacity-70">
      <div className="">
        <AnimatePresence>
          {props.hover && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.1 }}
              className="absolute top-0 left-0 h-full pl-2"
            >
              <ControlBar onClose={props.onClose} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!props.hover && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.1 }}
              className="absolute top-0 left-0 h-full pl-2"
            >
              <SimpleGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        onClick={() => {
          usePageState.setState({ menuPanelVisible: true })
        }}
      >
        <img width={18} height={18} src={chrome.runtime.getURL("logo-128.png")} alt="" />
      </button>
    </div>
  )
}

// " /sometext " => "sometext "
const formatSearchText = (triggerSymbol: string[], text: string) => {
  const str = text.trimStart()
  const symbol = triggerSymbol
    .filter((item) => str.startsWith(item))
    .sort((a, b) => b.length - a.length)[0]
  if (symbol) return str.slice(symbol.length)
  return text
}

function SnippetsPicker(props: { onClose: () => void }) {
  const isUnmountRef = useIsUnmount()
  const snippets = useSnippets(snippetsSelectors.snippets)
  const target = usePageState((state) => state.currentInput)
  const triggerSymbol = usePageState((state) => state.triggerSymbol)
  const wrapperSymbol = usePageState((state) => state.wrapperSymbol)
  const inputMode = usePageState((state) => state.inputMode)
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  const [text, setText] = useState<string | null>(
    target ? formatSearchText(triggerSymbol, getInputValue(target)) : null
  )
  const [currentSelectedSnippet, setCurrentSelectedSnippet] = useState<Snippet | null>(null)
  const [popupActive, setPopupActive] = useState(true)
  const [hover, setHover] = useState(false)
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
  const candidateSnippetsRef = useRef(candidateSnippets)
  candidateSnippetsRef.current = candidateSnippets
  const activeCandidateSnippet = useMemo(() => {
    return candidateSnippets.find((item) => item.item.id === activeId)
  }, [candidateSnippets, activeId])
  const applySnippetRef = useRef<() => void>()
  applySnippetRef.current = () => {
    const snippet = snippets.find((item) => item.id === activeIdRef.current)
    if (snippet && target) {
      if (inputMode === "Popup" && getVariables(snippet.content, wrapperSymbol).length > 0) {
        setCurrentSelectedSnippet(snippet)
        setPopupActive(false)
      } else {
        setInputValue(target, snippet.content)
        selectNextRange(wrapperSymbol, target)
      }
    }
  }
  useEffect(() => {
    if (!target) {
      setText(null)
      return
    }
    const onChange = (text: string) => {
      setText(text ? formatSearchText(triggerSymbol, text) : null)
    }
    const unsubscribe = setChangeListener(target, onChange)
    return unsubscribe
  }, [target, triggerSymbol])
  useEffect(() => {
    if (!popupActive) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        const currentSnippets = candidateSnippetsRef.current
        if (currentSnippets.length === 0) return
        e.preventDefault()
        setActiveId((activeId) => {
          const activeIndex = currentSnippets.findIndex(({ item }) => item.id === activeId)
          const nextIndex = activeIndex < currentSnippets.length - 1 ? activeIndex + 1 : 0
          return currentSnippets[nextIndex].item.id
        })
      }
      if (e.key === "ArrowUp") {
        const currentSnippets = candidateSnippetsRef.current
        if (currentSnippets.length === 0) return
        e.preventDefault()
        setActiveId((activeId) => {
          const activeIndex = currentSnippets.findIndex(({ item }) => item.id === activeId)
          const nextIndex = activeIndex > 0 ? activeIndex - 1 : currentSnippets.length - 1
          return currentSnippets[nextIndex].item.id
        })
      }
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        applySnippetRef.current?.()
      }
    }
    document.addEventListener("keydown", onKeyDown, { capture: true })
    return () => {
      document.removeEventListener("keydown", onKeyDown, { capture: true })
    }
  }, [popupActive, snippets, target])
  useEffect(() => {
    if (candidateSnippets[0]?.matches) {
      setActiveId(candidateSnippets[0]?.item.id)
    } else {
      setActiveId(null)
    }
  }, [candidateSnippets])
  useEffect(() => {
    if (activeId) {
      const activeEl = document
        .getElementById(ROOT_ID)
        ?.shadowRoot?.querySelector("#ps-p-" + activeId)
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        })
      }
    }
  }, [activeId])

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
        <motion.div
          className="relative"
          variants={{ active: { opacity: 1 }, inactive: { opacity: 0 } }}
          animate={popupActive ? "active" : "inactive"}
        >
          <Container
            className="flex flex-col"
            onMouseEnter={() => {
              setHover(true)
            }}
            onMouseLeave={() => {
              setHover(false)
            }}
          >
            <>
              <div className="p-1 flex-1 overflow-y-auto">
                {candidateSnippets.map(({ item, matches }) => (
                  <div
                    key={item.id}
                    id={"ps-p-" + item.id}
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
              <Footer hover={hover} onClose={props.onClose} />
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
                <Container className="!overflow-y-auto">
                  <div className="px-4 py-2 text-content-300">
                    <div className="text-sm">
                      <HighlightText
                        className="mr-1.5"
                        text={activeCandidateSnippet.item.name}
                        positions={
                          activeCandidateSnippet.matches?.filter(
                            (match) => match.key === "name"
                          )?.[0]?.indices || []
                        }
                      ></HighlightText>
                      <Tags tags={activeCandidateSnippet.item.tags} />
                    </div>
                    <div className="text-xs mt-1 whitespace-pre-wrap">
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
        </motion.div>
      )}
      <AnimatePresence>
        {currentSelectedSnippet && (
          <InputPopup
            snippet={currentSelectedSnippet}
            onClose={() => {
              setCurrentSelectedSnippet(null)
              setPopupActive(true)
            }}
            onSubmit={(text) => {
              setCurrentSelectedSnippet(null)
              setTimeout(() => {
                if (target) {
                  setInputValue(target, text)
                  awesomeSetSelectionRange(target, text.length, text.length)
                }
                setTimeout(() => {
                  if (!isUnmountRef.current) {
                    setPopupActive(true)
                  }
                }, 300)
              }, 55)
            }}
          ></InputPopup>
        )}
      </AnimatePresence>
    </>
  )
}

function ControlBar(props: { onClose: () => void }) {
  return (
    <div className="flex items-center gap-2 h-full">
      <button
        className="btn btn-icon btn-sm"
        onClick={() => {
          props.onClose()
        }}
      >
        <MiClose />
      </button>
    </div>
  )
}

function SimpleGuide() {
  return (
    <div className="flex items-center gap-2 h-full">
      <span className="inline-flex items-center gap-1">
        <KBD>
          <MiArrowUp />
        </KBD>
        <KBD className="-ml-0.5">
          <MiArrowDown />
        </KBD>
        navigate
      </span>
      <span className="inline-flex items-center gap-1">
        <KBD>
          <MiEnter />
        </KBD>
        select
      </span>
    </div>
  )
}

function SnippetsPopupInner() {
  const snippets = useSnippets(snippetsSelectors.snippets)
  const rootRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const target = usePageState((state) => state.currentInput)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const closePanel = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.activeElement === target) {
        setVisible(false)
      }
    }
    document.addEventListener("keydown", closePanel, { capture: true })
    return () => {
      document.removeEventListener("keydown", closePanel, { capture: true })
    }
  }, [target])

  useEffect(() => {
    const rootEl = rootRef.current
    const contentEl = contentRef.current
    const setPosition = throttle(() => {
      if (!rootEl || !contentEl || !target) return
      const targetRect = target.getBoundingClientRect()
      const top = targetRect.top
      const lineHeight = parseInt(getComputedStyle(target).lineHeight) || 16
      const bottom = targetRect.top + lineHeight + 16
      const bottomFromBottom = window.innerHeight - bottom
      if (top < 240 + 16 && bottomFromBottom > 240) {
        rootEl.style.left = targetRect.left + "px"
        rootEl.style.top = bottom + "px"
        contentEl.style.top = "8px"
        contentEl.style.bottom = "initial"
      } else {
        rootEl.style.left = targetRect.left + "px"
        rootEl.style.top = targetRect.top + "px"
        contentEl.style.bottom = "8px"
        contentEl.style.top = "initial"
      }
    }, 17)
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
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.1 }}
          className="absolute left-0 z-[100000] group"
          ref={contentRef}
        >
          {snippets.length > 0 ? (
            <SnippetsPicker onClose={() => setVisible(false)}></SnippetsPicker>
          ) : (
            <NoSnippets></NoSnippets>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default function SnippetsPopup() {
  const disabled = usePageState(pageStateSelectors.disabled)
  const target = usePageState((state) => state.currentInput)
  const triggerSymbol = usePageState((state) => state.triggerSymbol)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!target) {
      setVisible(false)
      return
    }
    const checkVisible = (text: string) => triggerSymbol.some((item) => text.startsWith?.(item))
    setVisible(checkVisible(getInputValue(target)))
    const onChange = (text: string) => {
      setVisible(checkVisible(text))
    }
    const unsubscribe = setChangeListener(target, onChange)
    return unsubscribe
  }, [target, triggerSymbol])

  return (
    <AnimatePresence>
      {visible && !disabled && <SnippetsPopupInner></SnippetsPopupInner>}
    </AnimatePresence>
  )
}
