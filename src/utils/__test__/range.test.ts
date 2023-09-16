import { expect, test } from "vitest"
import { getNextRange } from "../range"

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
