import { debounce } from "lodash"
import {
  COMMON_SETTINGS,
  DEFAULT_DISABLED_URLS,
  DEFAULT_IDS,
  DEFAULT_SNIPPET_GUIDE,
} from "./constants"
import { ServerStore, Snippet } from "./types"
import { getUriKey } from "./utils/uri"

let store: ServerStore

async function init() {
  // init store
  async function initStore() {
    const {
      isUsed = false,
      ids = DEFAULT_IDS,
      disabledUrls = DEFAULT_DISABLED_URLS,
      ...commonSettings
    } = await chrome.storage.sync
      .get(["isUsed", "ids", "disabledUrls", ...Object.keys(COMMON_SETTINGS)])
      .catch(() => ({} as any))
    let snippetsStore: Record<string, Snippet> = {}
    if (ids?.length > 0) {
      snippetsStore = await chrome.storage.sync.get([...ids]).catch(() => ({} as any))
    }
    // init default snippet if not used before
    if (!isUsed && ids?.length === 0) {
      ids.push(DEFAULT_SNIPPET_GUIDE.id)
      snippetsStore[DEFAULT_SNIPPET_GUIDE.id] = DEFAULT_SNIPPET_GUIDE
      chrome.storage.sync.set({ isUsed: true })
      chrome.storage.sync.set({ ids })
      chrome.storage.sync.set({ [DEFAULT_SNIPPET_GUIDE.id]: DEFAULT_SNIPPET_GUIDE })
    }
    store = {
      ids,
      snippetsStore,
      disabledUrls,
      ...COMMON_SETTINGS,
      ...commonSettings,
    }

    sendInitStoreMessage()
  }
  async function sendInitStoreMessage() {
    const tabs = await chrome.tabs.query({ active: true })
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "prompt-snippets/init-store",
          payload: store,
        })
      }
    })
  }

  initStore()

  // set listener
  chrome.action.onClicked.addListener((tab) => {
    console.log("action", tab)
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id!, { type: "prompt-snippets/toggle-menu" })
    }
  })

  chrome.storage.sync.onChanged.addListener((changes) => {
    console.log("changes", changes)
    Object.entries(changes).forEach(([key, changeObj]) => {
      for (const [commonSettingsKey, defaultValue] of Object.entries(COMMON_SETTINGS)) {
        if (commonSettingsKey === key) {
          // @ts-ignore
          store[key] = changeObj.newValue ?? defaultValue
          return
        }
      }
      if (key === "disabledUrls") {
        store.disabledUrls = changeObj.newValue ?? DEFAULT_DISABLED_URLS
      } else if (key === "ids") {
        store.ids = changeObj.newValue ?? DEFAULT_IDS
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

  let showNew = false
  chrome.runtime.onInstalled.addListener(async (reason) => {
    if (reason.reason === chrome.runtime.OnInstalledReason.UPDATE) {
      if (!reason.previousVersion) return
      try {
        const [major, minor] = chrome.runtime.getManifest().version.split(".")
        const [major2, minor2] = reason.previousVersion.split(".")
        if (major === major2 && minor === minor2) return
        // big version change should show NEW
        showNew = true
        chrome.action.setBadgeBackgroundColor({ color: "#ff4d4f" })
        chrome.action.setBadgeText({ text: " " })
        const tabs = await chrome.tabs.query({ active: true })
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "prompt-snippets/init-show-new",
            payload: showNew,
          })
        }
      } catch (err) {
        //
      }
    }
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message", message, sender, store)
    if (message?.type === "prompt-snippets/get-store") {
      if (store) {
        sendResponse(store)
      } else {
        initStore().then(() => {
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
    if (message.type === "prompt-snippets/get-show-new") {
      sendResponse(showNew)
    }
    if (message.type === "prompt-snippets/close-new") {
      showNew = false
      chrome.action.setBadgeText({ text: "" })
    }
  })
}

init()

// chrome.runtime.onInstalled.addListener((reason) => {
//   console.log(reason)
//   if (
//     reason.reason === chrome.runtime.OnInstalledReason.INSTALL ||
//     reason.reason === chrome.runtime.OnInstalledReason.UPDATE
//   ) {
//     checkCommandShortcuts()
//   }
// })

// function checkCommandShortcuts() {
//   chrome.commands.getAll((commands) => {
//     const missingShortcuts = []

//     for (const { name, shortcut } of commands) {
//       if (shortcut === "") {
//         missingShortcuts.push(name)
//       }
//     }

//     console.log("commands", commands, missingShortcuts)
//     if (missingShortcuts.length > 0) {
//       // Update the extension UI to inform the user that one or more
//       // commands are currently unassigned.
//     }
//   })
// }
