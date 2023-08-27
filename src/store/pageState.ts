import { create } from "zustand"
import { DEFAULT_TRIGGER_SYMBOL, DEFAULT_WRAPPER_SYMBOL } from "../constants"

type PageState = {
  disabled: boolean
  currentInput: HTMLInputElement | HTMLTextAreaElement | null
  snippetsPopupVisible: boolean
  menuPanelVisible: boolean
  settingsPanelVisible: boolean
  triggerSymbol: string[]
  wrapperSymbol: string[]

  updateDisabled: (disabled: boolean) => void
  updateTriggerSymbol: (triggerSymbol: string[]) => void
  updateWrapperSymbol: (wrapperSymbol: string[]) => void
}

export const usePageState = create<PageState>()((set) => ({
  disabled: true,
  currentInput: null,
  snippetsPopupVisible: false,
  menuPanelVisible: false,
  settingsPanelVisible: false,
  triggerSymbol: DEFAULT_TRIGGER_SYMBOL,
  wrapperSymbol: DEFAULT_WRAPPER_SYMBOL,

  updateDisabled: (disabled) => {
    set({ disabled })
    chrome.runtime.sendMessage({
      type: "prompt-snippets/toggle",
      payload: {
        disabled,
      },
    })
  },
  updateTriggerSymbol: (triggerSymbol) => {
    set({ triggerSymbol })
    chrome.storage.sync.set({ triggerSymbol })
  },
  updateWrapperSymbol: (wrapperSymbol) => {
    set({ wrapperSymbol })
    chrome.storage.sync.set({ wrapperSymbol })
  },
}))
