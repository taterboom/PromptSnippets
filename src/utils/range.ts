export const parseWrapperSymbol = (wrapperSymbol: string) => {
  return wrapperSymbol
    .trim()
    .split(/\s+/)
    .map((item) => item.trim())
}

type RangeObj = {
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

export const selectNextRange = (
  wrapperSymbol: string[],
  inputEl: HTMLInputElement | HTMLTextAreaElement
) => {
  const nextRange = getNextRange(wrapperSymbol, inputEl.value)
  if (nextRange) {
    awesomeSetSelectionRange(inputEl, nextRange.range[0], nextRange.range[1])
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

export type SnippetChunk =
  | {
      type: "raw"
      content: string
    }
  | {
      type: "variable"
      content: string
      variable: {
        name: string
        range: RangeObj
      }
    }

export function getSnippetChunks(snippetContent: string, wrapperSymbol: string[]) {
  const snippetChunks: SnippetChunk[] = []
  let lastIndex = 0
  while (lastIndex < snippetContent.length) {
    const fakeText =
      Array.from({ length: lastIndex })
        .map(() => " ")
        .join("") + snippetContent.slice(lastIndex)
    const nextRange = getNextRange(wrapperSymbol, fakeText)
    if (nextRange) {
      if (lastIndex < nextRange.range[0]) {
        const rawContent = snippetContent.slice(lastIndex, nextRange.range[0])
        snippetChunks.push({
          type: "raw",
          content: rawContent,
        })
      }
      const [left, right] = parseWrapperSymbol(nextRange.wrapper)
      const name = snippetContent
        .slice(nextRange.range[0] + left.length, nextRange.range[1] - right.length)
        .trim()
      snippetChunks.push({
        type: "variable",
        content: snippetContent.slice(nextRange.range[0], nextRange.range[1]),
        variable: {
          name,
          range: nextRange,
        },
      })
      lastIndex = nextRange.range[1]
    } else {
      const rawContent = snippetContent.slice(lastIndex)
      snippetChunks.push({
        type: "raw",
        content: rawContent,
      })
      break
    }
  }
  return snippetChunks
}

export const getVariables = (snippetContent: string, wrapperSymbol: string[]) => {
  const chunks = getSnippetChunks(snippetContent, wrapperSymbol)
  return chunks.reduce((acc, curr) => {
    if (curr.type === "variable" && !acc.includes(curr.variable!.name)) {
      acc.push(curr.variable!.name)
    }
    return acc
  }, [] as string[])
}
