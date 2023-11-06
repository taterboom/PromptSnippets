import { create } from "zustand"
import { COMMON_SETTINGS } from "../constants"
import { InputElement } from "../types"
import { debouncedWriteToChromeStorage } from "../utils/extensionUtils"
import { memoMatchUri } from "../utils/uri"

type PageState = typeof COMMON_SETTINGS & {
  currentInput: InputElement | null
  snippetsPopupVisible: boolean
  menuPanelVisible: boolean
  settingsPanelVisible: boolean
  importAndExportPanelVisible: boolean
  searchText: string
  selectedTags: string[]
  isFiltering: boolean
  enabledWebsites: string[]

  updateCommonSettings: (settings: Partial<typeof COMMON_SETTINGS>) => void
  updateEnabledWebsites: (enabledWebsites: string[]) => void
}

export const usePageState = create<PageState>()((set) => ({
  currentInput: null,
  snippetsPopupVisible: false,
  menuPanelVisible: false,
  settingsPanelVisible: false,
  importAndExportPanelVisible: false,
  searchText: "",
  selectedTags: [],
  isFiltering: false,
  enabledWebsites: [],
  ...COMMON_SETTINGS,

  updateCommonSettings: (settings: Partial<typeof COMMON_SETTINGS>) => {
    set(settings)
    chrome.storage.sync.set(settings)
  },
  updateEnabledWebsites(enabledWebsites: string[]) {
    set({ enabledWebsites })
    debouncedWriteToChromeStorage({ enabledWebsites })
  },
}))

export const pageStateSelectors = {
  disabled: (state: PageState) => {
    return !state.enabledWebsites.some((pattern) => memoMatchUri(window.location.href, pattern))
  },
}
