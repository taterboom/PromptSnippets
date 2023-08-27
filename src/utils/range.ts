export const getNextRange = (wrapperSymbol: string[], text: string) => {
  return wrapperSymbol
    .map((item) => {
      const [left, right] = item
        .trim()
        .split(" ")
        .map((str) => str.trim())
      const leftIndex = text.indexOf(left)
      if (leftIndex === -1) return
      const rightIndex = text.indexOf(right, leftIndex + left.length)
      if (rightIndex === -1) return
      return [leftIndex, rightIndex + right.length]
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
  console.log("range", inputEl.value, range)
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
