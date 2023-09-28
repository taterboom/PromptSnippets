import { useMemo, useRef, useState } from "react"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"
import { MiClose } from "./UI/icons"
import { unparse, parse } from "papaparse"
import { Snippet } from "../types"
import { genId } from "../utils/id"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "classnames"
import Expandable from "./UI/Expandable"
import ScrollContainer from "./UI/ScrollContainer"
import Tags from "./Tags"

type ExportableSnippet = Pick<Snippet, "id" | "content"> & {
  prefix: Snippet["name"]
  tags: string
}

type ExportableAllData = {
  snippets: ExportableSnippet[]
}

type ImportableAllData = {
  snippets: Snippet[]
}

function formatSnippet(snippet: Snippet): ExportableSnippet {
  return {
    id: snippet.id,
    prefix: snippet.name,
    content: snippet.content,
    tags: snippet.tags?.join(",") || "",
  }
}

function parseSnippetsLike(snippetsLike: any[]) {
  const snippets: Snippet[] = []
  for (const snippetLike of snippetsLike) {
    // adapt for AI Prompt Genius
    const prefix = snippetLike.prefix || snippetLike.name || snippetLike.title
    // adapt for AI Prompt Genius
    const content = snippetLike.content || snippetLike.text
    if (!(prefix && content)) {
      continue
    }
    const tags = Array.isArray(snippetLike.tags)
      ? snippetLike.tags
      : [
          ...new Set(
            snippetLike.tags
              ?.split(",")
              .map((t: string) => t.trim())
              .filter(Boolean)
          ),
        ]
    snippets.push({
      id: snippetLike.id || genId(),
      name: prefix,
      content,
      tags,
    })
  }
  return snippets
}

function parseEverythingImported(unkown: unknown): ImportableAllData | null {
  if (!unkown || typeof unkown !== "object") return null
  if ("snippets" in unkown) {
    return {
      snippets: parseSnippetsLike(unkown.snippets as any[]),
    }
  }
  // adapt for AI Prompt Genius
  if ("prompts" in unkown) {
    return {
      snippets: parseSnippetsLike(unkown.prompts as any[]),
    }
  }
  if (Array.isArray(unkown)) {
    return {
      snippets: parseSnippetsLike(unkown),
    }
  }
  return null
}

const FILE_MMIE = {
  json: "application/json",
  txt: "text/plain",
  csv: "text/csv",
}

const getDateString = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  return `${year}${month < 10 ? "0" + month : month}${date < 10 ? "0" + date : date}`
}

function ExportSnippets() {
  const download = (type: keyof typeof FILE_MMIE) => {
    const filename = `PromptSnippets-snippets-${getDateString()}.${type}`
    const data = snippetsSelectors.snippets(useSnippets.getState()).map(formatSnippet)
    let fileStr: string
    if (type === "csv") {
      fileStr = unparse(data)
    } else {
      const exportableAllData: ExportableAllData = { snippets: data }
      fileStr = JSON.stringify(exportableAllData)
    }
    const file = new File([fileStr], filename, {
      type: FILE_MMIE[type],
    })
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="flex flex-col gap-2">
      {Object.keys(FILE_MMIE).map((type) => (
        <button
          key={type}
          className="btn btn-sm !h-[22px] btn-primary"
          onClick={() => {
            download(type as keyof typeof FILE_MMIE)
          }}
        >
          Export {type.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function ImportSnippets(props: { onImport: (data: ImportableAllData) => void }) {
  const handleImport = (unkown: unknown) => {
    const data = parseEverythingImported(unkown)
    if (!data) {
      alert("No valid data found")
      return
    }
    if (data.snippets.length === 0) {
      alert("No valid snippets found")
      return
    }
    props.onImport(data)
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="btn btn-sm !h-[22px] btn-primary cursor-pointer">
        Import Any
        <input
          className="hidden"
          type="file"
          accept={Object.keys(FILE_MMIE)
            .map((t) => "." + t)
            .join()}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (file.type === FILE_MMIE.csv) {
              parse(file, {
                header: true,
                complete: (result) => {
                  handleImport(result.data)
                },
                error: (err) => {
                  alert("Import error")
                },
              })
            } else {
              const fileReader = new FileReader()
              fileReader.onload = (e) => {
                const result = e.target?.result as string | undefined
                if (!result) return
                try {
                  handleImport(JSON.parse(result))
                } catch (err) {
                  alert("Import error")
                }
              }
              fileReader.readAsText(file)
            }
          }}
        />
      </label>
    </div>
  )
}

const checkIsDuplicated = (snippet1: Snippet, snippet2: Snippet) => {
  return (
    snippet1.id === snippet2.id ||
    (snippet1.content === snippet2.content && snippet1.name === snippet2.name)
  )
}

function ImportCandidate(props: {
  data: ImportableAllData
  onClose: () => void
  onConfirm?: () => void
}) {
  const snippetsInStore = useSnippets(snippetsSelectors.snippets)
  const importSnippets = useSnippets((state) => state.importSnippets)
  const [selectIds, setSelectIds] = useState<string[]>(
    props.data.snippets
      .filter((s) => !snippetsInStore.some((s2) => checkIsDuplicated(s, s2)))
      .map((s) => s.id)
  )
  const hasDuplicate = useMemo(() => {
    return props.data.snippets.some((s) => snippetsInStore.some((s2) => checkIsDuplicated(s, s2)))
  }, [props.data.snippets, snippetsInStore])

  return (
    <PopupContainer wrapperClassName="!px-2" onClick={props.onClose}>
      <div className="flex justify-between items-center px-2 min-w-[200px]">
        <div className="text-base font-semibold">Import</div>
        <button className="btn btn-icon" onClick={props.onClose}>
          <MiClose />
        </button>
      </div>
      <h3 className="text-sm text-content-300 px-2">Select the snippets.</h3>
      <ScrollContainer className="divide-y divide-base-400 max-h-[300px]">
        {props.data.snippets.map((snippet, index) => {
          const isDuplicated = snippetsInStore.some((s) => checkIsDuplicated(s, snippet))
          return (
            <div
              key={index}
              className={clsx(
                "group flex gap-2 items-center py-1.5 px-2 hover:bg-base-300 space-y-1",
                isDuplicated && "opacity-50"
              )}
            >
              <div className={clsx("flex-shrink-0", hasDuplicate && "min-w-[64px]")}>
                {isDuplicated ? (
                  <span className="text-danger-200 text-sm">Duplicated</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={selectIds.includes(snippet.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectIds([...selectIds, snippet.id])
                      } else {
                        setSelectIds(selectIds.filter((id) => id !== snippet.id))
                      }
                    }}
                  />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1 overflow-hidden">
                  <div className="text-sm flex-1 text-left">
                    <span className="mr-1.5">{snippet.name}</span>
                    <Tags tags={snippet.tags} />
                  </div>
                </div>
                <Expandable className="text-xs text-content-300 transition-all">
                  {snippet.content}
                </Expandable>
              </div>
            </div>
          )
        })}
      </ScrollContainer>
      <div className="flex justify-end gap-2 items-center">
        <button className="btn" onClick={props.onClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            importSnippets(props.data.snippets.filter((s) => selectIds.includes(s.id)))
            props.onConfirm?.()
          }}
        >
          Save
        </button>
      </div>
    </PopupContainer>
  )
}

export default function ImportAndExportPanel(props: { onClose: () => void }) {
  const [importKey, setImportKey] = useState(0)
  const [importCandidateVisible, setImportCandidateVisible] = useState(false)
  const importableAllDataRef = useRef<ImportableAllData | null>(null)
  const resetImport = () => setImportKey((v) => v + 1)
  return (
    <PopupContainer wrapperClassName="!px-2" onClick={props.onClose}>
      <div className="flex justify-between items-center px-2 min-w-[200px]">
        <div className="text-base font-semibold">Import/Export</div>
        <button className="btn btn-icon" onClick={props.onClose}>
          <MiClose />
        </button>
      </div>
      <div className="px-2 space-y-2">
        <div>
          <div className="font-medium mb-2">Export</div>
          <ExportSnippets />
        </div>
        <div>
          <div className="font-medium mb-2">Import</div>
          <ImportSnippets
            key={importKey}
            onImport={(data) => {
              importableAllDataRef.current = data
              setImportCandidateVisible(true)
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {importCandidateVisible && (
          <ImportCandidate
            data={importableAllDataRef.current!}
            onClose={() => {
              setImportCandidateVisible(false)
              resetImport()
            }}
            onConfirm={() => {
              setImportCandidateVisible(false)
              props.onClose?.()
            }}
          ></ImportCandidate>
        )}
      </AnimatePresence>
    </PopupContainer>
  )
}
