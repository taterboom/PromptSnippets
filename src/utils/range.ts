export const getNextRange = (text: string) => {
  const result = text.match(/\{\{[^{}]*\}\}/)
  if (result && result[0] && result.index !== undefined) {
    return [result.index, result.index + result[0].length]
  }
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

export const selectNextRange = (inputEl: HTMLInputElement | HTMLTextAreaElement) => {
  const range = getNextRange(inputEl.value)
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
