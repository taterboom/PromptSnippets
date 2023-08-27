export type Snippet = {
  id: string
  name: string
  content: string
}

export type ServerStore = {
  disabledUrls: string[]
  ids: string[]
  snippetsStore: Record<string, Snippet>
}
