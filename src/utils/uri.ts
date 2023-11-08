import { memoize } from "lodash"
import { pathToRegexp } from "path-to-regexp"

export function getUriKey(href: string, ignoreWWW = false) {
  const urlObj = new URL(href)
  const uriKey = `${
    urlObj.hostname.startsWith("www.") && ignoreWWW ? urlObj.hostname.slice(4) : urlObj.hostname
  }${urlObj.pathname}`
  return uriKey
}

export function makePathRegExp(pattern: string) {
  let advancedPattern = pattern.trim()
  if (advancedPattern.length === 0) return null
  if (!advancedPattern.endsWith("*")) {
    advancedPattern = `${advancedPattern}*`
  }
  advancedPattern = advancedPattern
    .replace(/\?/g, "\\?") // ?k=v => \?k=v
    .replace(/:\/\//g, "\\:\\/\\/") // :// => \:\/\/
    .replace(/\*/g, "(.*)") // * => (.*)
  const regExp = pathToRegexp(advancedPattern)
  return regExp
}

export function matchUri(uri: string, pattern: string) {
  try {
    const regexp = makePathRegExp(pattern)
    if (!regexp) return false
    const key = getUriKey(uri)
    const noWWWKey = getUriKey(uri, true)
    return regexp.test(uri) || regexp.test(key) || regexp.test(noWWWKey)
  } catch (err) {
    console.error(`[Error] enabled websites: invalid pattern ${pattern}`)
    return false
  }
}

export const memoMatchUri = memoize(matchUri, (...args) => args.join(""))
