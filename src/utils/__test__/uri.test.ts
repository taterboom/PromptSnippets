/* eslint-disable no-useless-escape */
import { describe, expect, it } from "vitest"
import { getUriKey, makePathRegExp, matchUri } from "../uri"

describe("getUriKey", () => {
  it("should return the correct uri key", () => {
    const uri =
      "https://www.google.com/search?q=promptsnippets&sca_esv=579734912&sxsrf=AM9HkKn21Syltr7lQXESWr5etfYv2abBIQ%3A1699262217609&source=hp&ei=Ca9IZfqWHs3i1e8P-L6wkA8&iflsig=AO6bgOgAAAAAZUi9GVbM7Y6G360HldaHIdRMm3mAATFg&ved=0ahUKEwi6v-qGha-CAxVNcfUHHXgfDPIQ4dUDCAo&uact=5&oq=promptsnippets&gs_lp=Egdnd3Mtd2l6Ig5wcm9tcHRzbmlwcGV0czIEECMYJzIHEAAYgAQYCkjoJ1DTDFiyIXABeACQAQCYAfQBoAGXFKoBBjAuMTEuM7gBA8gBAPgBAagCCsICBxAjGOoCGCfCAgcQIxiKBRgnwgIIEAAYigUYkQLCAhQQLhiKBRixAxiDARjHARjRAxiRAsICCxAuGIAEGLEDGIMBwgIREC4YgAQYsQMYgwEYxwEY0QPCAgsQABiABBixAxiDAcICCBAAGIAEGLEDwgILEC4YgwEYsQMYigXCAg4QLhjHARixAxjRAxiABMICCBAuGIAEGLEDwgILEC4YgwEYsQMYgATCAggQLhixAxiABMICCxAAGIoFGLEDGJECwgIFEAAYgATCAgoQABjLARiABBgK&sclient=gws-wiz"
    expect(getUriKey(uri)).toBe("www.google.com/search")
    expect(getUriKey(uri, true)).toBe("google.com/search")
  })
})

describe("makePathRegExp", () => {
  it("should return a regular expression for the given uri pattern", () => {
    let uriPattern = "google.com"
    let uriRegExp = makePathRegExp(uriPattern)
    expect(uriRegExp).toEqual(/^google\.com(.*)[\/#\?]?$/i)

    uriPattern = "*google.com"
    uriRegExp = makePathRegExp(uriPattern)
    expect(uriRegExp).toEqual(/^(.*)google\.com(.*)[\/#\?]?$/i)

    uriPattern = "*google.com*"
    uriRegExp = makePathRegExp(uriPattern)
    expect(uriRegExp).toEqual(/^(.*)google\.com(.*)[\/#\?]?$/i)

    uriPattern = "https://www.google.com"
    uriRegExp = makePathRegExp(uriPattern)
    expect(uriRegExp).toEqual(/^https\:\/\/www\.google\.com(.*)[\/#\?]?$/i)
  })
})

describe("matchUri", () => {
  it("should return null if the uri does not match the pattern", () => {
    const uri = "https://www.google.com"
    let uriPattern = "openai.com"
    let match = matchUri(uri, uriPattern)
    expect(match).toBeFalsy()

    uriPattern = "https://google.com"
    match = matchUri(uri, uriPattern)
    expect(match).toBeFalsy()
  })

  it("should return an object with the uri parameters if the uri matches the pattern", () => {
    let uri = "https://www.google.com"
    let uriPattern = "*google.com"
    let match = matchUri(uri, uriPattern)
    expect(match).toBeTruthy()

    uri = "https://www.google.com"
    uriPattern = "google.com"
    match = matchUri(uri, uriPattern)
    expect(match).toBeTruthy()

    uri = "https://bard.google.com"
    uriPattern = "*google.com"
    match = matchUri(uri, uriPattern)
    expect(match).toBeTruthy()

    uri = "https://bard.google.com/chat?a=b"
    uriPattern = "*google.com"
    match = matchUri(uri, uriPattern)
    expect(match).toBeTruthy()
  })
})
