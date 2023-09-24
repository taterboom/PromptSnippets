import { useEffect, useRef } from "react"
import clsx from "classnames"

const BG = {
  100: ["from-base-100", "to-base-100/0"],
  200: ["from-base-200", "to-base-200/0"],
  300: ["from-base-300", "to-base-300/0"],
  400: ["from-base-400", "to-base-400/0"],
}

export default function ScrollContainer(
  props: { bg?: 100 | 200 | 300 | 400 } & React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current!
    const scrollHandler = () => {
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        topRef.current!.style.opacity = scrollTop <= 8 ? "0" : "1"
        bottomRef.current!.style.opacity = scrollTop + clientHeight >= scrollHeight - 8 ? "0" : "1"
      }
    }
    scrollHandler()
    container?.addEventListener("scroll", scrollHandler)
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries?.[0].target === container) {
        scrollHandler()
      }
    })
    resizeObserver.observe(container)
    return () => {
      container?.removeEventListener("scroll", scrollHandler)
      resizeObserver.disconnect()
    }
  }, [])
  const gradinet = BG[props.bg ?? 100] ?? BG[100]
  return (
    <div className="relative">
      <div
        className={
          "absolute top-0 left-0 w-full h-12 bg-gradient-to-b transition-opacity z-20 " +
          gradinet[0] +
          " " +
          gradinet[1]
        }
        ref={topRef}
      ></div>
      <div className={clsx("overflow-y-auto", props.className)} ref={containerRef}>
        {props.children}
      </div>
      <div
        className={
          "absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t transition-opacity z-20 " +
          gradinet[0] +
          " " +
          gradinet[1]
        }
        ref={bottomRef}
      ></div>
    </div>
  )
}
