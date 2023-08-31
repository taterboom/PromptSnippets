"use client"

import { useRef, useState } from "react"

export default function FeatureCard(props: { title: React.ReactNode; content: React.ReactNode }) {
  const glowBgEl = useRef<HTMLDivElement>(null)
  const onMouseMove = (e: any) => {
    const target = e.currentTarget
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glowBgEl.current?.style.setProperty("--x", `${x}px`)
    glowBgEl.current?.style.setProperty("--y", `${y}px`)
  }
  return (
    <div className="bg-base-100 p-4">
      <div
        className="group relative px-10 py-3 bg-base-100 text-content-100 rounded-2xl overflow-hidden"
        onMouseMove={onMouseMove}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                // "linear-gradient(225.44deg,rgb(251 57 134 / 0.9),hsla(0,0%,100%,.2) 25%,hsla(0,0%,100%,.2) 75%,rgb(70 176 254 / 0.7))",
                "linear-gradient(225.44deg,#fff,hsla(0,0%,100%,.2) 25%,hsla(0,0%,100%,.2) 75%,hsla(0,0%,100%,.5))",
            }}
          ></div>
          <div className="absolute inset-0 bg-base-100 text-content-100 transition-opacity opacity-0 group-hover:opacity-10"></div>
          <div
            className="absolute inset-px rounded-2xl bg-base-100"
            style={{
              backgroundImage:
                "linear-gradient(238.51deg,hsla(0,0%,100%,0) 1.7%,hsla(0,0%,100%,.1) 43.93%,hsla(0,0%,100%,0) 109.83%)",
            }}
          ></div>
          <div
            ref={glowBgEl}
            className="absolute inset-px rounded-2xl opacity-0 group-hover:opacity-50"
            style={{
              background: "radial-gradient( circle at var(--x) var(--y), #666, #0000000f )",
              transition: "opacity 0.5s",
            }}
          ></div>
        </div>
        <div className="relative z-10 cursor-default">
          <div className="text-base text-content-100">{props.title}</div>
          <div className="text-sm text-content-300">{props.content}</div>
        </div>
      </div>
    </div>
  )
}
