import { VARIABLE_DEFAULT_VALUE_SEPARATOR } from "../constants"
import { RangeObj, SelectNextRangeProcess, getNextRange, setInputValue } from "./range"

export const parseWrapperSymbol = (wrapperSymbol: string) => {
  return wrapperSymbol
    .trim()
    .split(/\s+/)
    .map((item) => item.trim())
}

export type Variable = {
  name: string
  defaultValue?: string
}

export const parseVariable = (content: string): Variable => {
  const [name, defaultValue] = content.split(VARIABLE_DEFAULT_VALUE_SEPARATOR)
  return {
    name,
    defaultValue,
  }
}

export type SnippetVariable = Variable & {
  range: RangeObj
}

export type SnippetChunk =
  | {
      type: "raw"
      content: string
    }
  | {
      type: "variable"
      content: string
      variable: SnippetVariable
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
      const variable = parseVariable(
        snippetContent
          .slice(nextRange.range[0] + left.length, nextRange.range[1] - right.length)
          .trim()
      )
      snippetChunks.push({
        type: "variable",
        content: snippetContent.slice(nextRange.range[0], nextRange.range[1]),
        variable: {
          ...variable,
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
    if (curr.type === "variable" && !acc.some((item) => item.name === curr.variable.name)) {
      acc.push(curr.variable)
    }
    return acc
  }, [] as Variable[])
}

export const processVariableSelection: SelectNextRangeProcess = (nextRange, _, inputEl) => {
  if (nextRange) {
    if (
      nextRange.range[0] === inputEl.selectionStart &&
      nextRange.range[1] === inputEl.selectionEnd
    ) {
      const text = inputEl.value
      const [left, right] = parseWrapperSymbol(nextRange.wrapper)
      const variable = parseVariable(
        text.slice(nextRange.range[0] + left.length, nextRange.range[1] - right.length).trim()
      )
      if (variable.defaultValue) {
        setInputValue(
          inputEl,
          text.slice(0, nextRange.range[0]) + variable.defaultValue + text.slice(nextRange.range[1])
        )
        return [nextRange.range[0], nextRange.range[0] + variable.defaultValue.length]
      }
    }
  }
}
