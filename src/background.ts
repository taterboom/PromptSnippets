// @ts-ignore
import contentScriptPath from "./contentScript?script"
chrome.action.onClicked.addListener((tab) => {
  console.log("!", tab, contentScriptPath)
  chrome.scripting
    .executeScript({
      target: { tabId: tab.id! },
      files: [contentScriptPath],
    })
    .catch((err) => {
      console.log("!!", err)
    })
})
