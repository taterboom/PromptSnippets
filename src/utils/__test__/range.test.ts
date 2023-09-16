import { expect, test } from "vitest"
import { getNextRange, getSnippetChunks } from "../range"

test("getNextRange should return the next range", () => {
  expect(getNextRange(["{ }"], "a{b}")?.range).toEqual([1, 4])
  expect(getNextRange(["{ }"], "a{b}")?.wrapper).toEqual("{ }")

  expect(getNextRange(["{ }"], "a{b]")?.range).toBeUndefined()
  expect(getNextRange(["{ }"], "a{b")?.range).toBeUndefined()
  expect(getNextRange(["{ }"], "a{b c}")?.range).toEqual([1, 6])
  expect(getNextRange(["{ }"], "a{b {cd}")?.range).toEqual([4, 8])
  expect(getNextRange(["{ }"], "a {b}c}")?.range).toEqual([2, 5])
})

test("Given multiple wrapper symbol, getNextRange should return the next range", () => {
  expect(getNextRange(["{ }", "[ ]"], "a{b}")?.range).toEqual([1, 4])
  expect(getNextRange(["{ }", "[ ]"], "a{b}")?.wrapper).toEqual("{ }")

  expect(getNextRange(["{ }", "[ ]"], "a[b]")?.range).toEqual([1, 4])
  expect(getNextRange(["{ }", "[ ]"], "a{b]")?.range).toBeUndefined()
  expect(getNextRange(["{ }", "[ ]"], "a[{b]")?.range).toEqual([1, 5])
  expect(getNextRange(["{ }", "[ ]"], "a[{b]}")?.range).toEqual([1, 5])
  expect(getNextRange(["{ }", "[ ]"], "a[{b}]")?.range).toEqual([1, 6])

  expect(getNextRange(["{ }", "[ ]"], "a[{b}]")?.wrapper).toEqual("[ ]")
})

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
