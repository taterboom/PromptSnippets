import { AnimatePresence } from "framer-motion"
import { usePageState } from "../store/pageState"
import { getUriKey } from "../utils/uri"
import { PopupContainer } from "./UI/Popup"
import { MiClose, MiDelete, MiRemove } from "./UI/icons"
import { PropsWithChildren, useState } from "react"
import { InputMode } from "../types"

function EnableSection() {
  const disabled = usePageState((state) => state.disabled)
  const updateDisabled = usePageState((state) => state.updateDisabled)

  return (
    <div className="p-2 hover:bg-base-200">
      <div className="flex gap-2">
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-content-100 break-words">Enable the extension</div>
          <div className="text-xs text-content-400 break-words">
            on the current page {getUriKey(window.location.href)}
          </div>
        </div>
        <div className="flex-shrink-0 pt-0.5">
          <input
            type="checkbox"
            className="checkbox"
            checked={!disabled}
            onChange={(e) => {
              updateDisabled(!e.target.checked)
            }}
          ></input>
        </div>
      </div>
    </div>
  )
}

function InputModeSection() {
  const inputMode = usePageState((state) => state.inputMode)
  const updateCommonSettings = usePageState((state) => state.updateCommonSettings)

  return (
    <div className="p-2 hover:bg-base-200">
      <div className="flex gap-2">
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-content-100 break-words">Variables Input Mode</div>
          <div className="text-xs text-content-400 break-words">
            Use the tab key or the popup box to input the variables.
          </div>
        </div>
        <div className="flex-shrink-0 pt-0.5">
          <select
            className="text-xs bg-base-200 text-content-200 border border-neutral-200 rounded transition-colors hover:border-neutral-300 focus-visible:outline-none"
            value={inputMode}
            onChange={(e) => updateCommonSettings({ inputMode: e.target.value as InputMode })}
          >
            <option value="Tab">Tab</option>
            <option value="Popup">Popup</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function WrapperSymbolSection() {
  const wrapperSymbol = usePageState((state) => state.wrapperSymbol)
  const updateCommonSettings = usePageState((state) => state.updateCommonSettings)
  const [createPopupVisible, setCreatePopupVisible] = useState(false)
  return (
    <>
      <div className="p-2 hover:bg-base-200">
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="text-sm text-content-100 break-words">Wrapper Symbol</div>
            <div className="text-xs text-content-400 break-words">
              Defines the symbol used to wrap variable content
            </div>
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => {
                setCreatePopupVisible(true)
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-2">
          {wrapperSymbol.map((symbol, index) => (
            <div key={index} className="py-0.5 flex justify-between items-center hover:bg-base-400">
              <div className="text-sm text-content-300 px-1.5 py-px rounded border border-neutral-200">
                {symbol}
              </div>
              <button
                className="btn btn-icon btn-ghost !text-danger-100"
                onClick={() => {
                  updateCommonSettings({
                    wrapperSymbol: wrapperSymbol.filter((_, i) => i !== index),
                  })
                }}
              >
                <MiRemove />
              </button>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {createPopupVisible && (
          <WrapperSymbolEditor
            onCancel={() => {
              setCreatePopupVisible(false)
            }}
            onSave={(value) => {
              setCreatePopupVisible(false)
              updateCommonSettings({ wrapperSymbol: [value, ...wrapperSymbol] })
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function WrapperSymbolEditor(props: { onCancel: () => void; onSave: (value: string) => void }) {
  const [text, setText] = useState("")
  return (
    <PopupContainer onClick={props.onCancel}>
      <div className="space-y-4">
        <div className="text-sm text-content-200">
          {"use a space as a variable placeholder, for example: {{ }}"}
        </div>
        <input
          type="text"
          className="block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end items-center gap-2">
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => props.onSave(text)}>
            Save
          </button>
        </div>
      </div>
    </PopupContainer>
  )
}

function TriggerSymbolSection() {
  const triggerSymbol = usePageState((state) => state.triggerSymbol)
  const updateCommonSettings = usePageState((state) => state.updateCommonSettings)
  const [createPopupVisible, setCreatePopupVisible] = useState(false)
  return (
    <>
      <div className="p-2 hover:bg-base-200">
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden">
            <div className="text-sm text-content-100 break-words">Trigger symbol</div>
            <div className="text-xs text-content-400 break-words">
              Defines the symbol that triggers commands at the beginning of the input text
            </div>
          </div>
          <div className="flex-shrink-0 pt-0.5">
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => {
                setCreatePopupVisible(true)
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-2">
          {triggerSymbol.map((symbol, index) => (
            <div key={index} className="py-0.5 flex justify-between items-center hover:bg-base-400">
              <div className="text-sm text-content-300 px-1.5 py-px rounded border border-neutral-200">
                {symbol}
              </div>
              <button
                className="btn btn-ghost btn-icon !text-danger-100"
                onClick={() => {
                  updateCommonSettings({
                    triggerSymbol: triggerSymbol.filter((_, i) => i !== index),
                  })
                }}
              >
                <MiRemove />
              </button>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {createPopupVisible && (
          <TriggerSymbolEditor
            onCancel={() => {
              setCreatePopupVisible(false)
            }}
            onSave={(value) => {
              setCreatePopupVisible(false)
              updateCommonSettings({ triggerSymbol: [value, ...triggerSymbol] })
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function TriggerSymbolEditor(props: { onCancel: () => void; onSave: (value: string) => void }) {
  const [text, setText] = useState("")
  return (
    <PopupContainer onClick={props.onCancel}>
      <div className="space-y-4">
        <div className="text-sm text-content-200">{"popup trigger symbol, for example: /"}</div>
        <input
          type="text"
          className="block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-1.5 px-2 focus:border-primary-100 focus-visible:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end items-center gap-2">
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => props.onSave(text)}>
            Save
          </button>
        </div>
      </div>
    </PopupContainer>
  )
}

export default function SettingsPanel(props: { onClose: () => void }) {
  return (
    <PopupContainer wrapperClassName="!px-2" onClick={props.onClose}>
      <div className="flex justify-between items-center px-2">
        <div className="text-base font-semibold">Settings</div>
        <button className="btn btn-icon" onClick={props.onClose}>
          <MiClose />
        </button>
      </div>
      <div className="divide-y divide-neutral-100">
        <EnableSection />
        <InputModeSection />
        <WrapperSymbolSection />
        <TriggerSymbolSection />
      </div>
    </PopupContainer>
  )
}
