import { useEffect } from "react"
import { ROOT_ID } from "../constants"
import { pageStateSelectors, usePageState } from "../store/pageState"
import { getAccurateActiveElement, isInputElement, selectNextRange } from "../utils/dom"
import { processVariableSelection } from "../utils/snippet"

export default function () {
  const disabled = usePageState(pageStateSelectors.disabled)
  useEffect(() => {
    if (disabled) return
    const root = document.getElementById(ROOT_ID)
    if (!root) return
    // check current active element
    const activeElement = getAccurateActiveElement(document.activeElement)
    if (isInputElement(activeElement)) {
      usePageState.setState({ currentInput: activeElement })
    }
    // listen to input element
    const onKeydown = async (e: KeyboardEvent) => {
      const target = e.target
      if (!target || !(target instanceof Element)) return
      if (!root.contains(target) && isInputElement(target)) {
        usePageState.setState({ currentInput: target })
        if (e.key === "Tab") {
          e.preventDefault()
          await selectNextRange(
            usePageState.getState().wrapperSymbol,
            target,
            processVariableSelection
          )
        }
      } else {
        // usePageState.setState({ currentInput: null })
      }
    }
    window.addEventListener("keydown", onKeydown, { capture: true })
    return () => {
      window.removeEventListener("keydown", onKeydown)
    }
  }, [disabled])
  return null
}
