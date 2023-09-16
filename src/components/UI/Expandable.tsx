import { useLayoutEffect, useRef, useState } from "react"
import clsx from "classnames"
import { useIsFirstMount } from "../../hooks/useIsFirstMount"

export default function Expandable(
  props: { lineHeight?: number } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const { lineHeight = 16 } = props
  const isFirstMount = useIsFirstMount()
  const [expanded, setExpanded] = useState(true)
  const elRef = useRef<HTMLDivElement>(null)
  const heightRef = useRef(0)

  useLayoutEffect(() => {
    heightRef.current = elRef.current!.clientHeight
    setExpanded(false)
  }, [])

  const expandable = heightRef.current > lineHeight + 4

  return (
    <div
      {...props}
      ref={elRef}
      className={clsx(
        props.className,
        !expanded && "truncate",
        expandable ? (expanded ? "cursor-zoom-out" : "cursor-zoom-in") : "cursor-default"
      )}
      style={{
        ...props.style,
        height: isFirstMount ? "auto" : expanded ? heightRef.current : lineHeight,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {props.children}
    </div>
  )
}
