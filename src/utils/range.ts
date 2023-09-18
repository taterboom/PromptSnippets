import { parseWrapperSymbol } from "./snippet"

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

export const awesomeSetSelectionRange = async (
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  start: number,
  end: number
) => {
  if (!inputEl) return
  // https://stackoverflow.com/a/66833098/17899444
  inputEl.blur()
  inputEl.setSelectionRange(start, start)
  inputEl.focus()
  inputEl.setSelectionRange(start, end)
}

export type SelectNextRangeProcess = (
  nextRange: RangeObj,
  wrapperSymbol: string[],
  inputEl: HTMLInputElement | HTMLTextAreaElement
) => [number, number] | void

export const selectNextRange = (
  wrapperSymbol: string[],
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  process?: SelectNextRangeProcess
) => {
  const nextRange = getNextRange(wrapperSymbol, inputEl.value)
  if (nextRange) {
    const range = process?.(nextRange, wrapperSymbol, inputEl) ?? nextRange.range
    awesomeSetSelectionRange(inputEl, range[0], range[1])
    return true
  } else {
    awesomeSetSelectionRange(inputEl, inputEl.value.length, inputEl.value.length)
    return false
  }
}

export const setInputValue = (inputEl: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  inputEl.value = value
  // dispatch an input event to trigger the input event listener for the main world to update the value
  const inputEvent = new InputEvent("input", {
    bubbles: true,
    cancelable: true,
  })
  inputEl.dispatchEvent(inputEvent)
}
