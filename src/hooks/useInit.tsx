import { useEffect, useState } from "react"
import { useSnippets } from "../store/snippets"
import { usePageState } from "../store/pageState"
import { ServerStore } from "../types"
import { getUriKey } from "../utils/uri"
import { COMMON_SETTINGS } from "../constants"

export function useInit() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const initState = (serverStore: ServerStore) => {
      useSnippets.setState({
        ids: serverStore.ids,
        snippetsStore: serverStore.snippetsStore,
      })
      const commonSettings = Object.keys(COMMON_SETTINGS).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = serverStore[key]
        return acc
      }, {} as typeof COMMON_SETTINGS)
      usePageState.setState({
        disabled: serverStore.disabledUrls?.includes?.(getUriKey(window.location.href)) ?? true,
        ...commonSettings,
      })
    }
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message?.type === "prompt-snippets/init-store") {
        initState(message.payload)
        setReady(true)
      }
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
      chrome.runtime
        .sendMessage({ type: "prompt-snippets/get-store" })
        .then((res) => {
          if (res) {
            initState(res)
            setReady(true)
          }
        })
        .catch((err) => {
          // the background is inactive
          // the background will send "prompt-snippets/init-store" message after active
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
