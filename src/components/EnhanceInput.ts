import { useEffect } from "react"
import { usePageState } from "../store/pageState"
import { selectNextRange } from "../utils/range"

export default function () {
  useEffect(() => {
    // check current active element
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      usePageState.setState({ currentInput: document.activeElement })
    }
    // listen to input element
    document.addEventListener("keydown", (e) => {
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
    })
  }, [])
  return null
}
