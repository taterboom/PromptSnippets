import { debounce } from "lodash"
import { ServerStore, Snippet } from "./types"

// should apply scripting permissions in manifest.json
// // @ts-ignore
// import contentScriptPath from "./contentScript?script"
// chrome.scripting
//   .executeScript({
//     target: { tabId: tab.id! },
//     files: [contentScriptPath],
//   })
//   .catch((err) => {
//     console.log("!!", err)
//   })
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id!, { type: "prompt-snippets/toggle-menu" })
  }
})

let store: ServerStore

async function init() {
  const { disabledUrls, ids } = await chrome.storage.sync.get(["disabledUrls", "ids"])
  let snippetsStore: Record<string, Snippet> = {}
  if (ids?.length) {
    snippetsStore = await chrome.storage.sync.get([...ids])
  }
  store = {
    disabledUrls: disabledUrls || [],
    ids: ids || [],
    snippetsStore: snippetsStore || {},
  }
}

init()

chrome.storage.sync.onChanged.addListener((changes) => {
  console.log("changes", changes)
  Object.entries(changes).forEach(([key, changeObj]) => {
    if (key === "ids") {
      store.ids = changeObj.newValue || []
    } else if (key === "disabledUrls") {
      store.disabledUrls = changeObj.newValue || []
    } else {
      if (changeObj.newValue) {
        store.snippetsStore[key] = changeObj.newValue
      } else {
        delete store.snippetsStore[key]
      }
    }
  })
})

const syncDisabledUrls = debounce(() => {
  chrome.storage.sync.set({ disabledUrls: store.disabledUrls })
}, 1000)
chrome.commands.onCommand.addListener((command, tab) => {
  console.log("command", command, tab)
  if (command === "toggle-prompt-snippets") {
    if (tab.id && tab.url) {
      const urlObj = new URL(tab.url)
      const urlKey = `${urlObj.hostname}${urlObj.pathname}`
      if (store.disabledUrls.includes(urlKey)) {
        store.disabledUrls = store.disabledUrls.filter((url) => url !== urlKey)
      } else {
        store.disabledUrls = [...store.disabledUrls, urlKey]
      }
      chrome.tabs.sendMessage(tab.id, {
        type: "prompt-snippets/update-store",
        payload: store,
      })
      syncDisabledUrls()
    }
  }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message", message, sender)
  if (message?.type === "prompt-snippets/get-store") {
    if (store) {
      sendResponse(store)
    } else {
      init().then(() => {
        sendResponse(store)
      })
      return true
    }
  }
})

chrome.runtime.onInstalled.addListener((reason) => {
  console.log(reason)
  if (
    reason.reason === chrome.runtime.OnInstalledReason.INSTALL ||
    reason.reason === chrome.runtime.OnInstalledReason.UPDATE
  ) {
    checkCommandShortcuts()
  }
})

function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    const missingShortcuts = []

    for (const { name, shortcut } of commands) {
      if (shortcut === "") {
        missingShortcuts.push(name)
      }
    }

    console.log("commands", commands, missingShortcuts)
    if (missingShortcuts.length > 0) {
      // Update the extension UI to inform the user that one or more
      // commands are currently unassigned.
    }
  })
}
