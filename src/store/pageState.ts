import { create } from "zustand"

type PageState = {
  currentInput: HTMLInputElement | HTMLTextAreaElement | null
  snippetsPopupVisible: boolean
}

export const usePageState = create<PageState>()(() => ({
  currentInput: null,
  snippetsPopupVisible: false,
}))
