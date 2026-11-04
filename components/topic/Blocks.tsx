import { css, mq, Style } from "@/components/ui/Style"
import { formatDate } from "@/lib/format"
import { Block, Source } from "@/lib/types"
import { sourceRefStyles, SourceRefs } from "./SourceRefs"

const styles = css`
  .Blocks {
    display: grid;
    gap: 18px;
  }
  .Blocks_p {
    line-height: 1.95;
  }
  .Blocks_list {
    padding-left: 1.4em;
    display: grid;
    gap: 6px;
  }
  .Blocks_list li::marker {
    color: var(--c-accent);
  }
  .Blocks_callout {
    background: var(--c-accent-soft);
    border-radius: var(--radius-sm);
    padding: 16px 18px;
    border: 2px dashed var(--c-accent);
  }
  .Blocks_calloutTitle {
    font-weight: 700;
    margin-bottom: 4px;
  }
  .Blocks_figures {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr;
    list-style: none;
  }
  ${mq.tablet} {
    .Blocks_figures {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .Blocks_figure {
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius-sm);
    padding: 14px 16px;
    display: grid;
    gap: 2px;
  }
  .Blocks_figureLabel {
    font-size: 0.8rem;
    color: var(--c-text-sub);
  }
  .Blocks_figureValue {
    font-size: 1.45rem;
    font-weight: 800;
    color: var(--c-accent);
    line-height: 1.4;
    letter-spacing: 0.01em;
  }
  .Blocks_figureNote {
    font-size: 0.75rem;
    color: var(--c-text-sub);
    line-height: 1.6;
  }
  ${sourceRefStyles}
`

/** 段落内の改行（\n）を <br> にする */
export const MultilineText = ({ text }: { text: string }) => (
  <>
    {text.split("\n").map((line, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {line}
      </span>
    ))}
  </>
)

export const Blocks = ({
  blocks,
  sources,
}: {
  blocks: Block[]
  sources: Source[]
}) => (
  <div className="Blocks">
    <Style id="Blocks">{styles}</Style>
    {blocks.map((b, i) => {
      switch (b.type) {
        case "paragraph":
          return (
            <p key={i} className="Blocks_p">
              <MultilineText text={b.text} />
              <SourceRefs ids={b.sourceIds} sources={sources} />
            </p>
          )
        case "list": {
          const L = b.ordered ? "ol" : "ul"
          return (
            <L key={i} className="Blocks_list">
              {b.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </L>
          )
        }
        case "callout":
          return (
            <aside key={i} className="Blocks_callout">
              {b.title && <p className="Blocks_calloutTitle">{b.title}</p>}
              <p>
                <MultilineText text={b.text} />
              </p>
            </aside>
          )
        case "figures":
          return (
            <ul key={i} className="Blocks_figures">
              {b.items.map((f, j) => (
                <li key={j} className="Blocks_figure">
                  <span className="Blocks_figureLabel">{f.label}</span>
                  <span className="Blocks_figureValue">
                    {f.value}
                    <SourceRefs ids={f.sourceIds} sources={sources} />
                  </span>
                  {(f.note || f.asOf) && (
                    <span className="Blocks_figureNote">
                      {f.note}
                      {f.asOf && `（${formatDate(f.asOf)}時点）`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )
      }
    })}
  </div>
)
