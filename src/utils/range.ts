export const getNextRange = (wrapperSymbol: string[], text: string) => {
  return wrapperSymbol
    .map((item) => {
      const [left, right] = item
        .trim()
        .split(/\s+/)
        .map((str) => str.trim())
      const firstRightIndex = text.indexOf(right)
      if (firstRightIndex === -1) return
      const lastLeftIndexBeforeFirstRightIndex = text.lastIndexOf(left, firstRightIndex)
      if (lastLeftIndexBeforeFirstRightIndex === -1) return
      return [lastLeftIndexBeforeFirstRightIndex, firstRightIndex + right.length]
    })
    .filter((item) => !!item)
    .sort((a, b) => {
      const sort1 = a![0] - b![0]
      if (sort1 !== 0) return sort1
      return a![1] - b![1]
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

export const selectNextRange = (
  wrapperSymbol: string[],
  inputEl: HTMLInputElement | HTMLTextAreaElement
) => {
  const range = getNextRange(wrapperSymbol, inputEl.value)
  if (range) {
    awesomeSetSelectionRange(inputEl, range[0], range[1])
    return true
  }
  return false
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
