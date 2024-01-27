import clsx from "classnames"
import { useEffect, useMemo, useRef } from "react"
import { usePageState } from "../store/pageState"
import { Snippet } from "../types"
import Expandable from "./UI/Expandable"
import { PopupContainer } from "./UI/Popup"
import { getSnippetChunks, getVariables } from "../utils/snippet"

type InputPopupProps = {
  snippet: Snippet
  onClose?: () => void
  onSubmit?: (text: string) => void
}

export function InputPopup(props: InputPopupProps) {
  const elRef = useRef<HTMLDivElement | null>(null)
  const values = useRef<Array<string | undefined>>([])
  const variables = useMemo(() => {
    return getVariables(props.snippet.content, usePageState.getState().wrapperSymbol)
  }, [props.snippet.content])
  const submitRef = useRef<any>()
  submitRef.current = () => {
    props.onSubmit?.(
      getSnippetChunks(props.snippet.content, usePageState.getState().wrapperSymbol)
        .map((item) => {
          if (item.type === "variable") {
            const index = variables.findIndex((variable) => item.variable.name === variable.name)
            const text = values.current[index]
            return text || variables[index].defaultValue || ""
          } else {
            return item.content
          }
        })
        .join("")
    )
  }
  useEffect(() => {
    elRef.current?.querySelector("input")?.focus()
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        e.stopPropagation()
        submitRef.current?.()
      }
    }
    window.addEventListener("keydown", onKeydown, { capture: true })
    return () => {
      window.removeEventListener("keydown", onKeydown, { capture: true })
    }
  }, [])
  return (
    <PopupContainer wrapperClassName="min-w-[448px] sm:max-w-lg" onClick={props.onClose}>
      <div>
        <div className={clsx("group space-y-1")}>
          <div className="flex items-center gap-2 overflow-hidden font-medium">
            {props.snippet.name}
          </div>
          <Expandable className="text-xs text-content-300 transition-all whitespace-pre-wrap">
            {props.snippet.content}
          </Expandable>
        </div>
        <div className="mt-4 mb-3 border-b border-neutral-200"></div>
        <div ref={elRef} className="space-y-1.5">
          {variables.map((variable, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm">{variable.name}</div>
              <div className="">
                <input
                  className="w-full p-1 text-sm block bg-base-200 text-content-200 border border-neutral-200 rounded py-1 px-2 focus:border-primary-100 focus-visible:outline-none"
                  defaultValue={variable.defaultValue}
                  onChange={(e) => {
                    values.current[index] = e.target.value
                  }}
                ></input>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 items-center">
        <button className="btn" onClick={props.onClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={submitRef.current}>
          Submit
        </button>
      </div>
    </PopupContainer>
  )
}
