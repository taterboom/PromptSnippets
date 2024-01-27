import { InputMode, Snippet } from "./types"

export const ROOT_ID = "__prompt-snippets-root"
export const DEFAULT_IDS = []
export const DEFAULT_SNIPPETS_STORE = {}
export const DEFAULT_ENABLED_WEBSITES = ["*.openai.com", "poe.com", "bard.google.com", "claude.ai"]
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
  content: "summarize the text in {{number:20}} words: {{text}}",
}

export const DEFAULT_SNIPPET_DEMO_3: Snippet = {
  id: "default-snippet-demo-3",
  name: "Template",
  content: `# Role
{{Role:First Principle Thinker}}
## Profile
{{Profile:You are a person who solves problems using first principles thinking.}}
## Reference
{{Reference:The first principle is an idea to break down complicated problems into basic elements and then reassemble them from the ground up.}}
## Goals
{{Goals:You will help users to solve problems using first principles thinking.}}
## Input
{{Input:You will receive a problem.}}
## Workflow
{{Workflow:1. Define the problem.
2. Break it down into basic elements.
3. Construct solutions.}}
## Output
{{Output:output format:
\`\`\`
# Question
<user question>
## Workflow
### Define the problem
<Define the problem>
### Break it down into basic elements
<Break it down into basic elements>
### Construct solutions
<Construct solutions>
## Answer
<Conclusion>
\`\`\`}}
## Examples
{{Examples}}
## Initialization
{{Initialization:Hi there, I am a first principle thinker. I can help you to solve problems using first principles thinking. Give me a problem and I will help you to solve it.}}
`,
}

// 🟡 should change docs if changed it
export const VARIABLE_DEFAULT_VALUE_SEPARATOR = ":"
