import { expect, test } from "vitest"
import { VARIABLE_DEFAULT_VALUE_SEPARATOR } from "../../constants"
import { getSnippetChunks, processVariableSelection } from "../snippet"

test("getSnippetChunks should be ok", () => {
  expect(getSnippetChunks("translate the text", ["{{ }}"])).toEqual([
    { type: "raw", content: "translate the text" },
  ])
  expect(getSnippetChunks("{{translate the text}}", ["{{ }}"])).toEqual([
    {
      type: "variable",
      content: "{{translate the text}}",
      variable: {
        name: "translate the text",
        range: { range: [0, 22], wrapper: "{{ }}" },
      },
    },
  ])
  expect(getSnippetChunks("translate the text to {{lang}}: {{text}}", ["{{ }}"])).toEqual([
    { type: "raw", content: "translate the text to " },
    {
      type: "variable",
      content: "{{lang}}",
      variable: { name: "lang", range: { range: [22, 30], wrapper: "{{ }}" } },
    },
    { type: "raw", content: ": " },
    {
      type: "variable",
      content: "{{text}}",
      variable: { name: "text", range: { range: [32, 40], wrapper: "{{ }}" } },
    },
  ])
  expect(
    getSnippetChunks("translate the text to {{lang}}: {{text}} [lang ]", ["{{ }}", "[ ]"])
  ).toEqual([
    { type: "raw", content: "translate the text to " },
    {
      type: "variable",
      content: "{{lang}}",
      variable: { name: "lang", range: { range: [22, 30], wrapper: "{{ }}" } },
    },
    { type: "raw", content: ": " },
    {
      type: "variable",
      content: "{{text}}",
      variable: { name: "text", range: { range: [32, 40], wrapper: "{{ }}" } },
    },
    { type: "raw", content: " " },
    {
      type: "variable",
      content: "[lang ]",
      variable: { name: "lang", range: { range: [41, 48], wrapper: "[ ]" } },
    },
  ])
})

test("processVariableSelection should be ok", () => {
  const inputEl = document.createElement("input")
  inputEl.value = `t {{lang${VARIABLE_DEFAULT_VALUE_SEPARATOR}zh}}: {{text}}`
  inputEl.selectionStart = 2
  inputEl.selectionEnd = 13
  expect(
    processVariableSelection(
      {
        range: [2, 13],
        wrapper: "{{ }}",
      },
      ["{{ }}"],
      inputEl
    )
  ).toEqual([2, 4])
})
