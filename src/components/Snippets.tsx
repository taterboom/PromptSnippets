import { snippetsSelectors, useSnippets } from "../store/snippets"
import { Snippet } from "../types"

function SnippetCard(props: { data: Snippet }) {
  return (
    <div>
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="text-sm flex-1 truncate">{props.data.name}</div>
        <div className="flex-shrink-0 flex gap-2">
          <button className="btn">Delete</button>
          <button className="btn">Edit</button>
        </div>
      </div>
      <div className="text-xs">{props.data.content}</div>
    </div>
  )
}

export default function Snippets() {
  const snippets = useSnippets(snippetsSelectors.snippets)
  return (
    <div className="px-3">
      {snippets.map((snippet: any) => {
        return <SnippetCard key={snippet.id} data={snippet}></SnippetCard>
      })}
    </div>
  )
}
