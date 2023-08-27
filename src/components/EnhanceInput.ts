import { useEffect } from "react"
import { ROOT_ID } from "../constants"
import { usePageState } from "../store/pageState"
import { selectNextRange } from "../utils/range"

export default function () {
  const disabled = usePageState((state) => state.disabled)
  useEffect(() => {
    if (disabled) return
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    // check current active element
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      usePageState.setState({ currentInput: document.activeElement })
    }
    // listen to input element
    const onKeydown = (e: KeyboardEvent) => {
      const target = e.target
      if (!target || !(target instanceof Node)) return
      if (
        !root.contains(target) &&
        (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
      ) {
        usePageState.setState({ currentInput: target })
        if (e.key === "Tab") {
          e.preventDefault()
          selectNextRange(usePageState.getState().wrapperSymbol, target)
        }
      } else {
        // usePageState.setState({ currentInput: null })
      }
    }
    document.addEventListener("keydown", onKeydown)
    return () => {
      document.removeEventListener("keydown", onKeydown)
    }
  }, [disabled])
  return null
}
