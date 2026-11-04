import { css, Style } from "@/components/ui/Style"
import { formatDate } from "@/lib/format"
import { Source } from "@/lib/types"

const styles = css`
  .SourceList {
    padding-left: 1.6em;
    display: grid;
    gap: 12px;
    font-size: 0.88rem;
    line-height: 1.7;
  }
  .SourceList li {
    scroll-margin-top: 96px;
  }
  .SourceList li:target {
    background: var(--c-accent-soft);
    border-radius: 4px;
  }
  .SourceList_title {
    font-weight: 600;
    word-break: break-word;
  }
  .SourceList_meta {
    color: var(--c-text-sub);
    font-size: 0.78rem;
  }
`

export const SourceList = ({ sources }: { sources: Source[] }) => (
  <ol className="SourceList">
    <Style id="SourceList">{styles}</Style>
    {sources.map((s) => (
      <li key={s.id} id={`source-${s.id}`}>
        <a
          className="SourceList_title"
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {s.title}
          <span className="sr-only">（外部サイトを新しいタブで開く）</span>
        </a>
        <div className="SourceList_meta">
          {s.publisher}
          {s.publishedAt && ` ／ 公表：${formatDate(s.publishedAt)}`}
          {` ／ 閲覧：${formatDate(s.accessedAt)}`}
        </div>
      </li>
    ))}
  </ol>
)
