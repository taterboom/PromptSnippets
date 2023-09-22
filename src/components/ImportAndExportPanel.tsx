import { useRef } from "react"
import { snippetsSelectors, useSnippets } from "../store/snippets"
import { PopupContainer } from "./UI/Popup"
import { MiClose } from "./UI/icons"
import { unparse, parse } from "papaparse"
import { Snippet } from "../types"
import { genId } from "../utils/id"

function parseSnippetsLike(snippetsLike: any[]) {
  const snippets: Snippet[] = []
  for (const snippetLike of snippetsLike) {
    const prefix = snippetLike.prefix || snippetLike.name || snippetLike.title
    const content = snippetLike.content
    if (!(prefix && content)) {
      continue
    }
    snippets.push({
      id: snippetLike.id || genId(),
      prefix,
      content,
    })
  }
  return snippets
}

type ExportableAllData = {
  snippets: Snippet[]
}

function parseEverythingImported(unkown: unknown): ExportableAllData | null {
  if (!unkown || typeof unkown !== "object") return null
  if (!("snippets" in unkown)) return null
  const maybeValidData = unkown as ExportableAllData
  return {
    snippets: parseSnippetsLike(maybeValidData.snippets),
  }
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
  const type = useRef("json")
  const download = () => {
    const filename = `PromptSnippets-snippets-${getDateString()}.${type.current}`
    const data = snippetsSelectors.snippets(useSnippets.getState())
    let fileStr: string
    if (type.current === "csv") {
      fileStr = unparse(data)
    } else {
      const exportableAllData: ExportableAllData = { snippets: data }
      fileStr = JSON.stringify(exportableAllData)
    }
    const file = new File([fileStr], filename, {
      type: FILE_MMIE[type.current as keyof typeof FILE_MMIE],
    })
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div>
      <button
        onClick={() => {
          download()
        }}
      >
        down
      </button>
      <select defaultValue={type.current} onChange={(e) => (type.current = e.target.value)}>
        <option value="json">json</option>
        <option value="txt">txt</option>
      </select>
    </div>
  )
}

function ImportSnippets() {
  return (
    <div>
      <input
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
                console.log(result)
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
                const data = parseEverythingImported(JSON.parse(result))
                console.log(data)
              } catch (err) {
                alert("Import error")
              }
            }
            fileReader.readAsText(file)
          }
        }}
      />
    </div>
  )
}

export default function ImportAndExportPanel(props: { onClose: () => void }) {
  return (
    <PopupContainer wrapperClassName="!px-2" onClick={props.onClose}>
      <div className="flex justify-between items-center px-2">
        <div className="text-base font-semibold">Import & Export</div>
        <button className="btn btn-icon" onClick={props.onClose}>
          <MiClose />
        </button>
      </div>
      <div className="divide-y divide-neutral-100">
        <div>
          <div>Export</div>
          <div>
            <div>Prompt snippets</div>
            <ExportSnippets />
          </div>
        </div>
        <div>
          <div>Import</div>
          <ImportSnippets />
        </div>
      </div>
    </PopupContainer>
  )
}
