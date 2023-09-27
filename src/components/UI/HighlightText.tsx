import { useMemo } from "react"
import Fuse from "fuse.js"
import clsx from "classnames"

export default function HighlightText(
  props: {
    text: string
    positions: Fuse.FuseResultMatch["indices"]
  } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) {
  const { text, positions } = props
  const chunks = useMemo(() => {
    const result: { highlight: boolean; data: string }[] = []
    let lastPosition = 0
    positions.forEach((position) => {
      const [start, end] = position
      result.push({ highlight: false, data: text.slice(lastPosition, start) })
      // the end position is inclusive in fuse matches indices
      result.push({ highlight: true, data: text.slice(start, end + 1) })
      lastPosition = end + 1
    })
    result.push({ highlight: false, data: text.slice(lastPosition) })
    return result.filter((item) => !!item.data)
  }, [text, positions])
  return (
    <>
      {chunks.map((chunk, index) => (
        <span
          key={index}
          {...props}
          className={clsx(props.className, chunk.highlight ? "text-primary-200" : "")}
        >
          {chunk.data}
        </span>
      ))}
    </>
  )
}
