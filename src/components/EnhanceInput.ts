import { useEffect } from "react"
import { ROOT_ID } from "../constants"
import { pageStateSelectors, usePageState } from "../store/pageState"
import { isInputElement, selectNextRange } from "../utils/dom"
import { processVariableSelection } from "../utils/snippet"

export default function () {
  const disabled = usePageState(pageStateSelectors.disabled)
  useEffect(() => {
    if (disabled) return
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    // check current active element
    if (isInputElement(document.activeElement)) {
      usePageState.setState({ currentInput: document.activeElement })
    }
    // listen to input element
    const onKeydown = (e: KeyboardEvent) => {
      const target = e.target
      if (!target || !(target instanceof Element)) return
      if (!root.contains(target) && isInputElement(target)) {
        usePageState.setState({ currentInput: target })
        if (e.key === "Tab") {
          e.preventDefault()
          selectNextRange(usePageState.getState().wrapperSymbol, target, processVariableSelection)
        }
      } else {
        // usePageState.setState({ currentInput: null })
      }
    }
    document.addEventListener("keydown", onKeydown, { capture: true })
    return () => {
      document.removeEventListener("keydown", onKeydown)
    }
  }, [disabled])
  return null
}
