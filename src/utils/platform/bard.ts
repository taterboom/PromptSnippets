/**
 * <rich-textarea>
 *  <div contenteditable="true">
 *    <p>type here</p>
 *  </div>
 * </rich-textarea>
 */

export type BardElement = HTMLElement & {
  contentEditable: "true"
}

export function isBardElement(element: Element | null | undefined): element is BardElement {
  return (
    !!element &&
    element.parentElement?.tagName === "RICH-TEXTAREA" &&
    element instanceof HTMLElement &&
    element.contentEditable === "true"
  )
}

export function getBardElementValue(element: BardElement) {
  return element.innerText
}

export function setBardElementValue(element: BardElement, value: string) {
  const p = document.createElement("p")
  p.textContent = value
  element.innerHTML = p.outerHTML
}

export function getBardElementSelectionRange(element: BardElement): [number, number] {
  const selectedText = window.getSelection()
  if (!selectedText) return [0, 0]
  const textNode = element.children?.[0]?.firstChild
  if (!textNode) return [0, 0]
  const range = selectedText.getRangeAt(0)
  if (!range) return [0, 0]
  if (range.startContainer !== textNode || range.endContainer !== textNode) return [0, 0]
  const start = range.startOffset
  const end = range.endOffset
  return [start, end]
}

export function setBardElementSelectionRange(element: BardElement, start: number, end: number) {
  const selectedText = window.getSelection()
  if (!selectedText) return
  const textNode = element.children?.[0]?.firstChild
  if (!textNode) return
  const selectedRange = document.createRange()
  selectedRange.setStart(textNode, start)
  selectedRange.setEnd(textNode, end)
  selectedText.removeAllRanges()
  selectedText.addRange(selectedRange)
  element.focus()
}

export function setBardElementChangeListener(
  element: BardElement,
  onChange: (value: string) => void
) {
  const observer = new MutationObserver((mutationList) => {
    onChange(getBardElementValue(element))
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
