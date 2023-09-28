import { create } from "zustand"
import { COMMON_SETTINGS } from "../constants"

type PageState = typeof COMMON_SETTINGS & {
  disabled: boolean
  currentInput: HTMLInputElement | HTMLTextAreaElement | null
  snippetsPopupVisible: boolean
  menuPanelVisible: boolean
  settingsPanelVisible: boolean
  helpPanelVisible: boolean
  importAndExportPanelVisible: boolean
  searchText: string
  selectedTags: string[]
  isFiltering: boolean

  updateDisabled: (disabled: boolean) => void
  updateCommonSettings: (settings: Partial<typeof COMMON_SETTINGS>) => void
}

export const usePageState = create<PageState>()((set) => ({
  disabled: true,
  currentInput: null,
  snippetsPopupVisible: false,
  menuPanelVisible: false,
  settingsPanelVisible: false,
  helpPanelVisible: false,
  importAndExportPanelVisible: false,
  searchText: "",
  selectedTags: [],
  isFiltering: false,
  ...COMMON_SETTINGS,

  updateDisabled: (disabled) => {
    set({ disabled })
    chrome.runtime.sendMessage({
      type: "prompt-snippets/toggle",
      payload: {
        disabled,
      },
    })
  },

  updateCommonSettings: (settings: Partial<typeof COMMON_SETTINGS>) => {
    set(settings)
    chrome.storage.sync.set(settings)
  },
}))
