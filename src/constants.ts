export const ROOT_ID = "__prompt-snippets-root"
export const DEFAULT_IDS = []
export const DEFAULT_SNIPPETS_STORE = {}
export const DEFAULT_DISABLED_URLS = []
export const DEFAULT_TRIGGER_SYMBOL = ["/", "、"]
export const DEFAULT_WRAPPER_SYMBOL = ["{{ }}"]

export const DEFAULT_SNIPPET_GUIDE = {
  id: "default-snippet-guide",
  name: "Welcome 👋",
  content:
    "Save time with variable snippets, type / in any input box, select with {{arrow}} keys, insert it with {{Enter}}, navigate variables with {{Tab}} and then fill them.",
}

export const DEFAULT_SNIPPET_DEMO_1 = {
  id: "default-snippet-demo-1",
  name: "Translate",
  content: "translate the text to {{lang}}: {{text}}",
}

export const DEFAULT_SNIPPET_DEMO_2 = {
  id: "default-snippet-demo-2",
  name: "Summary",
  content: "summarize the text in {{number}} words: {{text}}",
}
