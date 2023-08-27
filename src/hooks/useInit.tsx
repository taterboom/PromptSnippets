import { useEffect, useState } from "react"
import { useSnippets } from "../store/snippets"
import { usePageState } from "../store/pageState"
import { ServerStore } from "../types"
import { getUriKey } from "../utils/uri"

export function useInit() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const initState = (serverStore: ServerStore) => {
      useSnippets.setState({
        ids: serverStore.ids,
        snippetsStore: serverStore.snippetsStore,
      })
      usePageState.setState({
        disabled: serverStore.disabledUrls?.includes?.(getUriKey(window.location.href)) ?? true,
        triggerSymbol: serverStore.triggerSymbol,
        wrapperSymbol: serverStore.wrapperSymbol,
      })
    }
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("message", message)
      if (message?.type === "prompt-snippets/update-store") {
        if (message?.payload) {
          initState(message.payload)
        }
      }
      if (message?.type === "prompt-snippets/toggle-menu") {
        usePageState.setState((state) => {
          return { menuPanelVisible: !state.menuPanelVisible }
        })
      }
    })
    const fetchStore = () => {
      chrome.runtime.sendMessage({ type: "prompt-snippets/get-store" }).then((res) => {
        if (res) {
          initState(res)
          setReady(true)
        }
      })
    }
    fetchStore()
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        fetchStore()
      }
    })
  }, [])
  return ready
}
