import { BardElement } from "./utils/platform/bard"

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
  disabledUrls: string[]
  wrapperSymbol: string[]
  triggerSymbol: string[]
  inputMode: InputMode
}

export type InputElement = HTMLInputElement | HTMLTextAreaElement | BardElement
