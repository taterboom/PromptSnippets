import { ContentEditableElement } from "./utils/platform/contenteditable"

export type Snippet = {
  id: string
  name: string
  content: string
  tags?: string[]
}

export type InputMode = "Tab" | "Popup"

export type ServerStore = {
  ids: string[]
  snippetsStore: Record<string, Snippet>
  wrapperSymbol: string[]
  triggerSymbol: string[]
  inputMode: InputMode
  enabledWebsites: string[]
}

export type InputElement = HTMLInputElement | HTMLTextAreaElement | ContentEditableElement
