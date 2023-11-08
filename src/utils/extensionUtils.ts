import { debounce } from "lodash"

// Define your function that will write to Chrome storage
function writeToChromeStorage(data: any) {
  chrome.storage.sync.set(data)
}

// Debounce the function with a delay of 500ms
export const debouncedWriteToChromeStorage = debounce(writeToChromeStorage, 400)
