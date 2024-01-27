export type ContentEditableElement = HTMLElement & {
  contentEditable: "true"
}

function check(element: Element | null | undefined): element is ContentEditableElement {
  return (
    !!element &&
    // element.parentElement?.tagName === "RICH-TEXTAREA" &&
    element instanceof HTMLElement &&
    element.contentEditable === "true"
  )
}

function getElementValue(element: ContentEditableElement) {
  return element.innerText
}

function selectAll(element: ContentEditableElement) {
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = window.getSelection()
  if (!selection) return
  selection.removeAllRanges()
  selection.addRange(range)
}

async function setElementValue(element: ContentEditableElement, value: string) {
  let changed = false
  const clear = setElementChangeListener(element, () => {
    changed = true
  })

  // 1. simulate input event flow
  // first, select all
  selectAll(element)
  await new Promise((resolve) => setTimeout(resolve, 20))
  // then dispatch beforeinput event
  const beforeInputEvent = new InputEvent("beforeinput", {
    bubbles: true,
    cancelable: true,
    inputType: "insertText",
    data: value,
  })
  element.dispatchEvent(beforeInputEvent)
  // then input event
  if (!beforeInputEvent.defaultPrevented) {
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      inputType: "insertText",
      data: value,
    })
    element.dispatchEvent(inputEvent)
  }
  await new Promise((resolve) => setTimeout(resolve, 20))

  // 2. if not changed, then change html directly
  if (!changed) {
    const p = document.createElement("p")
    p.textContent = value
    element.innerHTML = p.outerHTML
  }

  clear()
}

function getElementSelectionRange(element: ContentEditableElement): [number, number] {
  const selectedText = window.getSelection()
  if (!selectedText) return [0, 0]
  const range = selectedText.getRangeAt(0)
  if (!range) return [0, 0]
  if (element.contains(range.startContainer) && element.contains(range.endContainer)) {
    const start = range.startOffset
    const end = range.endOffset
    return [start, end]
  } else {
    return [0, 0]
  }
}

function setElementSelectionRange(element: ContentEditableElement, start: number, end: number) {
  const selectedText = window.getSelection()
  if (!selectedText) return
  const textNode = selectedText.anchorNode
  if (!textNode) return
  if (!element.contains(textNode)) return
  const selectedRange = document.createRange()
  selectedRange.setStart(textNode, start)
  selectedRange.setEnd(textNode, end)
  selectedText.removeAllRanges()
  selectedText.addRange(selectedRange)
  element.focus()
}

function setElementChangeListener(
  element: ContentEditableElement,
  onChange: (value: string) => void
) {
  const observer = new MutationObserver((mutationList) => {
    onChange(getElementValue(element))
  })
  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  })
  return () => {
    observer.disconnect()
  }
}

const contentEditableUtils = {
  check: check,
  getElementValue,
  setElementValue,
  getElementSelectionRange,
  setElementSelectionRange,
  setElementChangeListener,
}

export default contentEditableUtils
