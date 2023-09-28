import { create } from "zustand"

import { pick } from "lodash"
import { DEFAULT_IDS, DEFAULT_SNIPPETS_STORE } from "../constants"
import { Snippet } from "../types"
import { genId } from "../utils/id"
import { toastErrWhenFailed } from "../utils/toastErrWhenFailed"
import { logger } from "../utils/zustandLog"

type SnippetsState = {
  ids: string[]
  snippetsStore: Record<string, Snippet>
  addSnippet: (snippet: Omit<Snippet, "id">) => void
  updateSnippet: (snippet: Snippet) => void
  removeSnippets: (ids: string[]) => void
  importSnippets: (snippets: Snippet[]) => void
}

export const useSnippets = create<SnippetsState>()(
  logger((set, get) => ({
    ids: DEFAULT_IDS,
    snippetsStore: DEFAULT_SNIPPETS_STORE,
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
    removeSnippets: (toBeRemovedIds) => {
      const ids = get().ids.filter((id) => !toBeRemovedIds.includes(id))
      set({ ids, snippetsStore: pick(get().snippetsStore, [...ids]) })
      toastErrWhenFailed([
        chrome.storage.sync.remove(toBeRemovedIds),
        chrome.storage.sync.set({ ids }),
      ])
    },
    importSnippets: (snippets) => {
      const ids = [...snippets.map((snippet) => snippet.id), ...get().ids]
      const snippetsStore = {
        ...get().snippetsStore,
        ...snippets.reduce((acc, snippet) => ({ ...acc, [snippet.id]: snippet }), {}),
      }
      set({ ids, snippetsStore })
      toastErrWhenFailed([
        chrome.storage.sync.set(
          snippets.reduce((acc, snippet) => ({ ...acc, [snippet.id]: snippet }), {})
        ),
        chrome.storage.sync.set({ ids }),
      ])
    },
  }))
)

export const snippetsSelectors = {
  snippets: (state: SnippetsState) => state.ids.map((id) => state.snippetsStore[id]),
  tags: (state: SnippetsState) => [
    ...new Set(
      Object.values(snippetsSelectors.snippets(state))
        .map((item) => item.tags)
        .filter(Boolean)
        .flat() as string[]
    ),
  ],
}
