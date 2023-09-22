export type Snippet = {
  id: string
  prefix: string
  content: string
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
