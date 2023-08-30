import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SnippetEditor from "./SnippetEditor"
import Snippets from "./Snippets"
import { usePageState } from "../store/pageState"
import { MiCircleHelp, MiAdd, MiClose, MiSearch, MiSettings } from "./UI/icons"
import SettingsPanel from "./SettingsPanel"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import HelpPanel from "./HelpPanel"

function Header(props: { onCreate?: () => void }) {
  const searchText = usePageState((state) => state.searchText)
  const snippes = useSnippets(snippetsSelectors.snippets)
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          <img width={24} height={24} src={chrome.runtime.getURL("logo-128.png")} alt="" />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              usePageState.setState({ helpPanelVisible: true })
            }}
          >
            <MiCircleHelp />
          </button>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              usePageState.setState({ settingsPanelVisible: true })
            }}
          >
            <MiSettings />
          </button>
          <button
            className="btn btn-icon"
            onClick={() => {
              usePageState.setState({ menuPanelVisible: false })
            }}
          >
            <MiClose />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <button className="btn btn-primary !px-2 !h-6" onClick={props.onCreate}>
          <MiAdd className="mr-1" /> Create
        </button>
        {snippes.length > 0 ? (
          <label className="relative">
            <input
              placeholder="Search Snippets"
              type="text"
              className="max-w-[160px] block text-xs bg-base-200 text-content-300 border border-neutral-200 rounded w-full py-1 px-2 focus:border-primary-100 focus-visible:outline-none"
              value={searchText}
              onChange={(e) => {
                usePageState.setState({ searchText: e.target.value })
              }}
            />
            {!searchText && (
              <span className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-content-300">
                <MiSearch />
              </span>
            )}
          </label>
        ) : (
          <div data-flex-item></div>
        )}
      </div>
    </div>
  )
}

export default function MenuPanel() {
  const menuPanelVisible = usePageState((state) => state.menuPanelVisible)
  const settingsPanelVisible = usePageState((state) => state.settingsPanelVisible)
  const helpPanelVisible = usePageState((state) => state.helpPanelVisible)
  const [snippetEditorVisible, setSnippetEditorVisible] = useState(false)
  return (
    <AnimatePresence>
      {menuPanelVisible && (
        <motion.div
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 32, opacity: 0 }}
          transition={{ duration: 0.12 }}
          // `will-change` is required to act as containing block for the fixed-position children such as popups
          className="will-change-transform fixed top-0 right-0 bottom-0 w-96 bg-base-100 shadow-lg z-[100000] flex flex-col"
        >
          <Header onCreate={() => setSnippetEditorVisible(true)}></Header>
          <div className="flex-1 overflow-y-auto mt-2">
            <Snippets onCreate={() => setSnippetEditorVisible(true)}></Snippets>
          </div>
          <AnimatePresence>
            {snippetEditorVisible && (
              <SnippetEditor
                onClose={() => {
                  setSnippetEditorVisible(false)
                }}
              ></SnippetEditor>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {settingsPanelVisible && (
              <SettingsPanel
                onClose={() => {
                  usePageState.setState({ settingsPanelVisible: false })
                }}
              ></SettingsPanel>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {helpPanelVisible && (
              <HelpPanel
                onClose={() => {
                  usePageState.setState({ helpPanelVisible: false })
                }}
              ></HelpPanel>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
