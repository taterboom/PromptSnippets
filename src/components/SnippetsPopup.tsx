import { useEffect, useMemo, useRef, useState } from "react"
import clsx from "classnames"
import { motion, AnimatePresence } from "framer-motion"
import { usePageState } from "../store/pageState"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { awesomeSetSelectionRange, selectNextRange, setInputValue } from "../utils/range"

function SnippetsPopupInner(props: { text: string }) {
  const { text } = props
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId
  const snippets = useSnippets(snippetsSelectors.snippets)
  const elRef = useRef<HTMLDivElement>(null)
  const target = usePageState((state) => state.currentInput)
  useEffect(() => {
    const el = elRef.current
    const setPosition = () => {
      if (!el || !target) return
      const targetRect = target.getBoundingClientRect()
      el.style.top = targetRect.top + "px"
      el.style.left = targetRect.left + "px"
    }
    setPosition()
    // setInterval(setPosition, 1000)
  }, [target])
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setActiveId((activeId) => {
          const activeIndex = snippets.findIndex((item) => item.id === activeId)
          const nextIndex = activeIndex < snippets.length - 1 ? activeIndex + 1 : 0
          return snippets[nextIndex].id
        })
      }
      if (e.key === "ArrowUp") {
        setActiveId((activeId) => {
          const activeIndex = snippets.findIndex((item) => item.id === activeId)
          const nextIndex = activeIndex > 0 ? activeIndex - 1 : snippets.length - 1
          return snippets[nextIndex].id
        })
      }
      if (e.key === "Enter") {
        const snippet = snippets.find((item) => item.id === activeIdRef.current)
        if (snippet && target) {
          setInputValue(target, snippet.content)
          if (!selectNextRange(target)) {
            awesomeSetSelectionRange(target, 0, 0)
          }
        }
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [snippets, target])

  return (
    <div ref={elRef} className="fixed">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.1 }}
        className="popup-shadow absolute bottom-2 left-0 z-[100000] w-80 max-h-60 bg-base-100 text-content-100 border border-neutral-200 rounded"
      >
        {snippets.map((item) => (
          <div
            key={item.id}
            className={clsx(
              "px-4 py-1 text-sm text-content-300",
              item.id === activeId && "!bg-base-400 !text-content-100"
            )}
            onMouseOver={() => setActiveId(item.id)}
          >
            {item.name}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function SnippetsPopup() {
  const target = usePageState((state) => state.currentInput)
  const [text, setText] = useState("")
  const visible = useMemo(() => {
    return text.startsWith("/")
  }, [text])
  useEffect(() => {
    if (!target) {
      setText("")
      return
    }
    const setTextValue = (e: any) => {
      // @ts-ignore
      setText(e.target.value)
    }
    setText(target.value)
    target.addEventListener("input", setTextValue)
    target.addEventListener("change", setTextValue)
    return () => {
      target.removeEventListener("input", setTextValue)
      target.removeEventListener("change", setTextValue)
    }
  }, [target])

  return (
    <AnimatePresence>
      {visible && <SnippetsPopupInner text={text}></SnippetsPopupInner>}
    </AnimatePresence>
  )
}
