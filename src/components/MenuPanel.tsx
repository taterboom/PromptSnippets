import clsx from "classnames"
import { AnimatePresence, motion, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import { useNew } from "../hooks/useNew"
import { usePageState } from "../store/pageState"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import ImportAndExportPanel from "./ImportAndExportPanel"
import SettingsPanel from "./SettingsPanel"
import SnippetEditor from "./SnippetEditor"
import Snippets from "./Snippets"
import {
  CarbonImportExport,
  MaterialSymbolsFilterAlt,
  MiAdd,
  MiCircleHelp,
  MiClose,
  MiSearch,
  MiSettings,
} from "./UI/icons"

function TagsSelector() {
  const isFiltering = usePageState((state) => state.isFiltering)
  const tags = useSnippets(snippetsSelectors.tags)
  const selectedTags = usePageState((state) => state.selectedTags)
  const [scope, animate] = useAnimate()
  useEffect(() => {
    animate("#tags", {
      height: isFiltering ? "auto" : 0,
    })
  }, [isFiltering])
  return (
    <div ref={scope}>
      <div id="tags" className="flex flex-wrap mt-2 items-center overflow-hidden h-0 gap-y-1">
        {tags.map((tag, index) => (
          <button
            key={tag}
            className={clsx(
              `inline-flex items-center px-1.5 h-[17px] border border-neutral-200 text-content-300 rounded text-[10px] mx-0.5 transition-colors hover:bg-base-400 hover:border-neutral-300 hover:text-content-200`,
              selectedTags.includes(tag)
                ? "!bg-primary-200 !border-primary-200 !text-primary-content-200"
                : "",
              index === 0 && "!ml-0"
            )}
            onClick={() => {
              if (selectedTags.includes(tag)) {
                usePageState.setState({ selectedTags: selectedTags.filter((t) => t !== tag) })
              } else {
                usePageState.setState({ selectedTags: [...selectedTags, tag] })
              }
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}

function Searcher() {
  const searchText = usePageState((state) => state.searchText)
  const isFiltering = usePageState((state) => state.isFiltering)
  const tags = useSnippets(snippetsSelectors.tags)
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
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
      </div>
      {tags.length > 0 && (
        <button
          className={clsx(
            "btn btn-icon btn-ghost !bg-none !bg-transparent !border-none",
            isFiltering
              ? "opacity-100 icon-shadow !text-content-100"
              : "opacity-75 hover:opacity-90"
          )}
          onClick={() => {
            usePageState.setState({ isFiltering: !isFiltering })
            if (isFiltering) {
              usePageState.setState({ selectedTags: [] })
            }
          }}
        >
          <MaterialSymbolsFilterAlt />
        </button>
      )}
    </div>
  )
}

function Header(props: { onCreate?: () => void }) {
  const snippes = useSnippets(snippetsSelectors.snippets)
  const tags = useSnippets(snippetsSelectors.tags)
  const [showNew, closeNew] = useNew()
  return (
    <div className="border-b border-base-400 pb-2">
      <div className="flex justify-between p-4">
        <div>
          <img width={24} height={24} src={chrome.runtime.getURL("logo-128.png")} alt="" />
        </div>
        <div className="flex items-center gap-2">
          {showNew && (
            <button
              className="text-xs text-danger-100 !text-[10px] hover:text-danger-200"
              onClick={() => {
                closeNew()
                chrome.runtime.sendMessage({ type: "prompt-snippets/close-new" })
                window.open("https://promptsnippets.top/changelog?from=extension")
              }}
            >
              NEW
            </button>
          )}
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              window.open("https://www.promptsnippets.top/docs/getting-started?from=extension")
            }}
          >
            <MiCircleHelp />
          </button>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => {
              usePageState.setState({ importAndExportPanelVisible: true })
            }}
          >
            <CarbonImportExport />
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
        {snippes.length > 0 ? <Searcher /> : <div data-flex-item></div>}
      </div>
      <div className="px-4">{tags.length > 0 && <TagsSelector />}</div>
    </div>
  )
}

export default function MenuPanel() {
  const menuPanelVisible = usePageState((state) => state.menuPanelVisible)
  const settingsPanelVisible = usePageState((state) => state.settingsPanelVisible)
  const importAndExportPanelVisible = usePageState((state) => state.importAndExportPanelVisible)
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
          <div className="flex-1 overflow-y-auto">
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
            {importAndExportPanelVisible && (
              <ImportAndExportPanel
                onClose={() => {
                  usePageState.setState({ importAndExportPanelVisible: false })
                }}
              ></ImportAndExportPanel>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
