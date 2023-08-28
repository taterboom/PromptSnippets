import KBD from "./UI/KBD"
import { PopupContainer } from "./UI/Popup"
import { MiClose, MiSettings } from "./UI/icons"

export default function HelpPanel(props: { onClose: () => void }) {
  return (
    <PopupContainer wrapperClassName="!px-2" onClick={props.onClose}>
      <div className="flex justify-between items-center px-2">
        <div className="text-base font-semibold">Help</div>
        <button className="btn btn-icon" onClick={props.onClose}>
          <MiClose />
        </button>
      </div>
      <div className="divide-y divide-neutral-100">
        <div className="p-2 hover:bg-base-200">
          <h2 className="text-sm text-content-100 font-semibold">How to use</h2>
          <div className="text-sm text-content-300 mt-1.5 space-y-px">
            <p>
              Trigger a snippets suggestion panel by typing <KBD>/</KBD> (can be configured as
              whatever you want) in any input box.
            </p>
            <p>
              Select a snippet from the panel by clicking on it or using the arrow keys to navigate
              and pressing Enter.
            </p>
            <p>
              Use the <KBD>Tab</KBD> key to navigate between variables within the snippet.
            </p>
          </div>
        </div>
        <div className="p-2 hover:bg-base-200">
          <h2 className="text-sm text-content-100 font-semibold">Customize</h2>
          <div className="text-sm text-content-300 mt-1.5 space-y-px">
            <p>
              Open the plugin settings panel by clicking <MiSettings className="inline" />
            </p>
            <p>You can customize trigger and wrapper symbol there</p>
          </div>
        </div>
        <div className="p-2 hover:bg-base-200">
          <h2 className="text-sm text-content-100 font-semibold">Disable</h2>
          <div className="text-sm text-content-300 mt-1.5 space-y-px">
            <p>Open the plugin settings panel, and disable the first option</p>
            <p>
              Or use the shortcut <KBD>Ctrl</KBD>/<KBD>Cmd</KBD> + <KBD>Shift</KBD> + <KBD>P</KBD>{" "}
              to toggle the extension in current page
            </p>
          </div>
        </div>
        <div className="p-2 hover:bg-base-200">
          <h2 className="text-sm text-content-100 font-semibold">Privacy Policy</h2>
          <div className="text-sm text-content-300 mt-1.5 space-y-px">
            <p>
              PromptSnippets extension stores your snippets and settings using{" "}
              <a
                className="underline"
                href="https://developer.chrome.com/docs/extensions/reference/storage/"
                target="_blank"
              >
                Chrome storage
              </a>
              . Data will not be sent to any other place.
            </p>
          </div>
        </div>
      </div>
    </PopupContainer>
  )
}
