import { Source } from "@/lib/types"

/** 本文中の出典参照 [1][2]。記事末尾の参考情報へのアンカーリンク */
export const SourceRefs = ({
  ids,
  sources,
}: {
  ids?: string[]
  sources: Source[]
}) => {
  if (!ids || ids.length === 0) return null
  return (
    <>
      {ids.map((id) => {
        const index = sources.findIndex((s) => s.id === id)
        if (index < 0) return null
        return (
          <sup key={id} className="SourceRef">
            <a
              href={`#source-${id}`}
              aria-label={`出典${index + 1}: ${sources[index].title}`}
            >
              [{index + 1}]
            </a>
          </sup>
        )
      })}
    </>
  )
}

export const sourceRefStyles = `
  .SourceRef { font-size: 0.7em; margin-left: 2px; line-height: 0; }
  .SourceRef a { color: var(--c-accent); text-decoration: none; font-weight: 700; }
  .SourceRef a:hover { text-decoration: underline; }
`
