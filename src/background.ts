import { debounce } from "lodash"
import {
  DEFAULT_DISABLED_URLS,
  DEFAULT_IDS,
  DEFAULT_SNIPPETS_STORE,
  DEFAULT_TRIGGER_SYMBOL,
  DEFAULT_WRAPPER_SYMBOL,
} from "./constants"
import { ServerStore, Snippet } from "./types"
import { getUriKey } from "./utils/uri"

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
  const { disabledUrls, triggerSymbol, wrapperSymbol, ids } = await chrome.storage.sync.get([
    "disabledUrls",
    "triggerSymbol",
    "wrapperSymbol",
    "ids",
  ])
  let snippetsStore: Record<string, Snippet> = {}
  if (ids?.length) {
    snippetsStore = await chrome.storage.sync.get([...ids])
  }
  store = {
    disabledUrls: disabledUrls || DEFAULT_DISABLED_URLS,
    ids: ids || DEFAULT_IDS,
    snippetsStore: snippetsStore || DEFAULT_SNIPPETS_STORE,
    triggerSymbol: triggerSymbol || DEFAULT_TRIGGER_SYMBOL,
    wrapperSymbol: wrapperSymbol || DEFAULT_WRAPPER_SYMBOL,
  }
}

init()

chrome.storage.sync.onChanged.addListener((changes) => {
  console.log("changes", changes)
  Object.entries(changes).forEach(([key, changeObj]) => {
    if (key === "ids") {
      store.ids = changeObj.newValue || DEFAULT_IDS
    } else if (key === "disabledUrls") {
      store.disabledUrls = changeObj.newValue || DEFAULT_DISABLED_URLS
    } else if (key === "triggerSymbol") {
      store.triggerSymbol = changeObj.newValue || DEFAULT_TRIGGER_SYMBOL
    } else if (key === "wrapperSymbol") {
      store.wrapperSymbol = changeObj.newValue || DEFAULT_WRAPPER_SYMBOL
    } else {
      // snippetsStore
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
      const uriKey = getUriKey(tab.url)
      if (store.disabledUrls.includes(uriKey)) {
        store.disabledUrls = store.disabledUrls.filter((url) => url !== uriKey)
      } else {
        store.disabledUrls = [...store.disabledUrls, uriKey]
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
  console.log("message", message, sender, store)
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
  if (message?.type === "prompt-snippets/toggle") {
    if (!sender.tab?.id || !sender.tab?.url) return
    const uriKey = getUriKey(sender.tab.url)
    const { disabled } = message.payload
    if (store.disabledUrls.includes(uriKey) && !disabled) {
      store.disabledUrls = store.disabledUrls.filter((url) => url !== uriKey)
    } else if (!store.disabledUrls.includes(uriKey) && disabled) {
      store.disabledUrls = [...store.disabledUrls, uriKey]
    }
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "prompt-snippets/update-store",
      payload: store,
    })
    syncDisabledUrls()
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
