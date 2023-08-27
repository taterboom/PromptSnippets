import { useEffect } from "react"
import { usePageState } from "../store/pageState"
import { selectNextRange } from "../utils/range"

export default function () {
  const disabled = usePageState((state) => state.disabled)
  useEffect(() => {
    if (disabled) return
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
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        usePageState.setState({ currentInput: target })
        if (e.key === "Tab") {
          e.preventDefault()
          selectNextRange(target)
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
