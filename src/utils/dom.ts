import { InputElement } from "../types"
import contentEditableUtils from "./platform/contenteditable"
import { parseWrapperSymbol } from "./snippet"

export function getAccurateActiveElement(el: Element | null) {
  if (el?.shadowRoot) {
    const activeElement = el.shadowRoot.activeElement
    if (activeElement) return getAccurateActiveElement(activeElement)
    return null
  } else {
    return el
  }
}

export const isInputElement = (element: Element | null | undefined): element is InputElement =>
  !!element &&
  (element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    contentEditableUtils.check(element))

export type RangeObj = {
  range: [number, number]
  wrapper: string
}
export const getNextRange = (wrapperSymbol: string[], text: string): RangeObj | undefined => {
  return wrapperSymbol
    .map((item) => {
      const [left, right] = parseWrapperSymbol(item)
      const firstRightIndex = text.indexOf(right)
      if (firstRightIndex === -1) return
      const lastLeftIndexBeforeFirstRightIndex = text.lastIndexOf(left, firstRightIndex)
      if (lastLeftIndexBeforeFirstRightIndex === -1) return
      return {
        range: [lastLeftIndexBeforeFirstRightIndex, firstRightIndex + right.length] as [
          number,
          number
        ],
        wrapper: item,
      }
    })
    .filter((item) => !!item)
    .sort((a, b) => {
      const aRange = a!.range
      const bRange = b!.range
      const sort1 = aRange[0] - bRange[0]
      if (sort1 !== 0) return sort1
      return aRange[1] - bRange[1]
    })[0]
}

export const getSelectionRange = (inputEl?: InputElement): [number, number] => {
  if (!inputEl) return [0, 0]
  if (contentEditableUtils.check(inputEl)) {
    return contentEditableUtils.getElementSelectionRange(inputEl)
  } else {
    return [inputEl.selectionStart || 0, inputEl.selectionEnd || 0]
  }
}

export const awesomeSetSelectionRange = async (
  inputEl: InputElement,
  start: number,
  end: number
) => {
  if (!inputEl) return
  if (contentEditableUtils.check(inputEl)) {
    contentEditableUtils.setElementSelectionRange(inputEl, start, end)
  } else {
    // https://stackoverflow.com/a/66833098/17899444
    inputEl.blur()
    inputEl.setSelectionRange(start, start)
    inputEl.focus()
    inputEl.setSelectionRange(start, end)
  }
}

export type SelectNextRangeProcess = (
  nextRange: RangeObj,
  wrapperSymbol: string[],
  inputEl: InputElement
) => Promise<[number, number] | void>

export const selectNextRange = async (
  wrapperSymbol: string[],
  inputEl: InputElement,
  process?: SelectNextRangeProcess
) => {
  const value = getInputValue(inputEl)
  const nextRange = getNextRange(wrapperSymbol, value)
  if (nextRange) {
    const range = (await process?.(nextRange, wrapperSymbol, inputEl)) ?? nextRange.range
    awesomeSetSelectionRange(inputEl, range[0], range[1])
    return true
  } else {
    awesomeSetSelectionRange(inputEl, value.length, value.length)
    return false
  }
}

export const setInputValue = async (inputEl: InputElement, value: string) => {
  if (contentEditableUtils.check(inputEl)) {
    return contentEditableUtils.setElementValue(inputEl, value)
  } else {
    inputEl.value = value
    // dispatch an input event to trigger the input event listener for the main world to update the value
    const inputEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
    })
    inputEl.dispatchEvent(inputEvent)
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

export const getInputValue = (inputEl: InputElement) => {
  if (contentEditableUtils.check(inputEl)) {
    return contentEditableUtils.getElementValue(inputEl)
  } else {
    return inputEl.value
  }
}

export function setChangeListener(inputEl: InputElement, onChange: (value: string) => void) {
  if (contentEditableUtils.check(inputEl)) {
    return contentEditableUtils.setElementChangeListener(inputEl, onChange)
  } else {
    const _onChange = (e: Event) => {
      onChange((e?.target as HTMLInputElement)?.value)
    }
    inputEl.addEventListener("input", _onChange)
    inputEl.addEventListener("change", _onChange)
    return () => {
      inputEl.removeEventListener("input", _onChange)
      inputEl.removeEventListener("change", _onChange)
    }
  }
}
