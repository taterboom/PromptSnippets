import {
  COMMON_SETTINGS,
  DEFAULT_ENABLED_WEBSITES,
  DEFAULT_IDS,
  DEFAULT_SNIPPET_GUIDE,
} from "./constants"
import { ServerStore, Snippet } from "./types"

let store: ServerStore

async function init() {
  // init store
  async function initStore() {
    const {
      isUsed = false,
      ids = DEFAULT_IDS,
      enabledWebsites = DEFAULT_ENABLED_WEBSITES,
      ...commonSettings
    } = await chrome.storage.sync
      .get(["isUsed", "ids", "enabledWebsites", ...Object.keys(COMMON_SETTINGS)])
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
      enabledWebsites,
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
      if (key === "enabledWebsites") {
        store.enabledWebsites = changeObj.newValue ?? DEFAULT_ENABLED_WEBSITES
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

  chrome.commands.onCommand.addListener((command, tab) => {
    console.log("command", command, tab.url)
    if (command === "toggle-prompt-snippets") {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "prompt-snippets/toggle-prompt-snippets",
        })
      }
    }
  })

  chrome.runtime.onInstalled.addListener(async (reason) => {
    if (reason.reason === chrome.runtime.OnInstalledReason.UPDATE) {
      if (!reason.previousVersion) return
      try {
        const [major, minor] = chrome.runtime.getManifest().version.split(".")
        const [major2, minor2] = reason.previousVersion.split(".")
        if (major === major2 && minor === minor2) return
        // big version change should show NEW
        chrome.action.setBadgeBackgroundColor({ color: "#ff4d4f" })
        chrome.action.setBadgeText({ text: " " })
        const tabs = await chrome.tabs.query({ active: true })
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "prompt-snippets/init-show-new",
            payload: true,
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
    if (message.type === "prompt-snippets/get-show-new") {
      if (!sender.tab?.id) return
      chrome.action.getBadgeText({ tabId: sender.tab.id }).then((badgeText) => {
        const showNew = badgeText === " "
        console.log("showNew", showNew)
        sendResponse(showNew)
      })
      return true
    }
    if (message.type === "prompt-snippets/close-new") {
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
