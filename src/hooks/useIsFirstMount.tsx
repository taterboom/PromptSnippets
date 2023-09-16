import { useRef } from "react"

export function useIsFirstMount() {
  const isFirst = useRef(true)
  if (isFirst.current) {
    isFirst.current = false
    return true
  }
  return isFirst.current
}
