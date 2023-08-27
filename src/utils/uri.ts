export function getUriKey(href: string) {
  const urlObj = new URL(href)
  const uriKey = `${urlObj.hostname}${urlObj.pathname}`
  return uriKey
}
