import { create } from "zustand"

import { pick } from "lodash"
import { Snippet } from "../types"
import { genId } from "../utils/id"
import { toastErrWhenFailed } from "../utils/toastErrWhenFailed"
import { logger } from "../utils/zustandLog"

type SnippetsState = {
  ids: string[]
  snippetsStore: Record<string, Snippet>
  init: () => Promise<void>
  addSnippet: (snippet: Omit<Snippet, "id">) => void
  updateSnippet: (snippet: Snippet) => void
  removeSnippet: (ids: string[]) => void
}

export const useSnippets = create<SnippetsState>()(
  logger((set, get) => ({
    ids: [],
    snippetsStore: {},
    init: async () => {
      const { ids } = await chrome.storage.sync.get(["ids"])
      if (!ids || !ids.length) {
        return
      }
      const snippetsStore = await chrome.storage.sync.get([...ids])
      set({
        ids,
        snippetsStore,
      })
    },
    addSnippet: (snippetWithoutId) => {
      const id = genId()
      const snippet = { ...snippetWithoutId, id }
      const ids = [id, ...get().ids]
      set({
        ids,
        snippetsStore: {
          ...get().snippetsStore,
          [id]: snippet,
        },
      })
      toastErrWhenFailed([
        chrome.storage.sync.set({ [id]: snippet }),
        chrome.storage.sync.set({ ids }),
      ])
    },
    updateSnippet: (snippet) => {
      set({
        snippetsStore: {
          ...get().snippetsStore,
          [snippet.id]: snippet,
        },
      })
      toastErrWhenFailed([chrome.storage.sync.set({ [snippet.id]: snippet })])
    },
    removeSnippet: (toBeRemovedIds) => {
      const ids = get().ids.filter((id) => !toBeRemovedIds.includes(id))
      set({ ids, snippetsStore: pick(get().snippetsStore, [...ids]) })
      toastErrWhenFailed([chrome.storage.sync.remove(ids), chrome.storage.sync.set({ ids })])
    },
  }))
)

export const snippetsSelectors = {
  snippets: (state: SnippetsState) => state.ids.map((id) => state.snippetsStore[id]),
}
