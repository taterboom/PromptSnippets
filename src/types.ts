export type Snippet = {
  id: string
  name: string
  content: string
}

export type ServerStore = {
  ids: string[]
  snippetsStore: Record<string, Snippet>
  disabledUrls: string[]
  wrapperSymbol: string[]
  triggerSymbol: string[]
}
