import { useEffect, useState } from "react"

const query = window.matchMedia("(prefers-color-scheme: dark)")

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(query.matches)
  useEffect(() => {
    const onQuery = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }
    query.addEventListener("change", onQuery)
    return () => {
      query.removeEventListener("change", onQuery)
    }
  }, [])
  return isDarkMode
}
