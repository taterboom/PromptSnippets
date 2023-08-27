import { useEffect, useState } from "react"
import { useSnippets } from "../store/snippets"
import { usePageState } from "../store/pageState"
import { ServerStore } from "../types"

export function useInit() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const initState = (serverStore: ServerStore) => {
      useSnippets.setState({
        ids: serverStore.ids,
        snippetsStore: serverStore.snippetsStore,
      })
      const urlObj = new URL(window.location.href)
      const urlKey = `${urlObj.hostname}${urlObj.pathname}`
      console.log("urlKey", urlKey, serverStore.disabledUrls)
      usePageState.setState({
        disabled: serverStore.disabledUrls?.includes?.(urlKey) ?? true,
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
