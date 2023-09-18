import { useCallback, useEffect, useState } from "react"

export function useNew() {
  const [showNew, setShowNew] = useState(false)
  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message?.type === "prompt-snippets/init-show-new") {
        setShowNew(message.payload)
      }
    })
    const fetchStore = () => {
      chrome.runtime
        .sendMessage({ type: "prompt-snippets/get-show-new" })
        .then((res) => {
          setShowNew(res)
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
  const close = () => setShowNew(false)
  return [showNew, close] as const
}
