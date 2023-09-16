import { useEffect, useRef } from "react"

export const useIsUnmount = () => {
  const isUnmountRef = useRef(false)
  useEffect(() => {
    return () => {
      isUnmountRef.current = true
    }
  }, [])
  return isUnmountRef
}
