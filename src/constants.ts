import { InputMode, Snippet } from "./types"

export const ROOT_ID = "__prompt-snippets-root"
export const DEFAULT_IDS = []
export const DEFAULT_SNIPPETS_STORE = {}
export const DEFAULT_DISABLED_URLS = []
export const DEFAULT_TRIGGER_SYMBOL = ["/", "、"]
export const DEFAULT_WRAPPER_SYMBOL = ["{{ }}"]
export const DEFAULT_INPUT_MODE: InputMode = "Tab"

export const COMMON_SETTINGS = {
  triggerSymbol: DEFAULT_TRIGGER_SYMBOL,
  wrapperSymbol: DEFAULT_WRAPPER_SYMBOL,
  inputMode: DEFAULT_INPUT_MODE as InputMode,
}

export const DEFAULT_SNIPPET_GUIDE: Snippet = {
  id: "default-snippet-guide",
  name: "Welcome 👋",
  content:
    "Save time with variable snippets, type / in any input box, select with {{arrow}} keys, insert it with {{Enter}}, navigate variables with {{Tab}} and then fill them.",
}

export const DEFAULT_SNIPPET_DEMO_1: Snippet = {
  id: "default-snippet-demo-1",
  name: "Translate",
  content: "translate the text to {{lang}}: {{text}}",
}

export const DEFAULT_SNIPPET_DEMO_2: Snippet = {
  id: "default-snippet-demo-2",
  name: "Summary",
  content: "summarize the text in {{number}} words: {{text}}",
}

// 🟡 should change docs if changed it
export const VARIABLE_DEFAULT_VALUE_SEPARATOR = ":"
