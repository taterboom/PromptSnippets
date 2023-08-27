import { create } from "zustand"

type PageState = {
  disabled: boolean
  currentInput: HTMLInputElement | HTMLTextAreaElement | null
  snippetsPopupVisible: boolean
  menuPanelVisible: boolean
}

export const usePageState = create<PageState>()(() => ({
  disabled: true,
  currentInput: null,
  snippetsPopupVisible: false,
  menuPanelVisible: false,
}))
