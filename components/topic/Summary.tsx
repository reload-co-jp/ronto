import { css, mq, Style } from "@/components/ui/Style"
import { formatDate } from "@/lib/format"
import { Source, Summary } from "@/lib/types"
import { sourceRefStyles, SourceRefs } from "./SourceRefs"

const styles = css`
  .Points {
    list-style: none;
    counter-reset: point;
    display: grid;
    gap: 10px;
  }
  .Points li {
    counter-increment: point;
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 10px;
    align-items: start;
    background: var(--c-surface);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    border: 2px solid var(--c-ink);
  }
  .Points li::before {
    content: counter(point);
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--c-yellow);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    font-weight: 900;
    font-size: 0.85rem;
    display: grid;
    place-items: center;
  }
  .ProsCons {
    display: grid;
    gap: 14px;
  }
  ${mq.tablet} {
    .ProsCons {
      grid-template-columns: 1fr 1fr;
    }
  }
  .ProsCons_col {
    border-radius: var(--radius-sm);
    padding: 16px 18px;
  }
  .ProsCons_col--for {
    background: #e3f6ee;
    border: 2px solid var(--c-ink);
  }
  .ProsCons_col--against {
    background: #ffe8de;
    border: 2px solid var(--c-ink);
  }
  .ProsCons_title {
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 1rem;
  }
  .ProsCons_list {
    padding-left: 1.2em;
    display: grid;
    gap: 8px;
    font-size: 0.92rem;
    line-height: 1.75;
  }
  .Impacts {
    display: grid;
    gap: 0;
    border-top: 1px solid var(--c-border);
  }
  .Impacts_row {
    display: grid;
    gap: 4px;
    padding: 14px 0;
    border-bottom: 1px solid var(--c-border);
  }
  ${mq.tablet} {
    .Impacts_row {
      grid-template-columns: 12em 1fr;
      gap: 16px;
    }
  }
  .Impacts_who {
    font-weight: 700;
  }
  .Impacts_impact {
    font-size: 0.92rem;
    line-height: 1.75;
  }
  .Learned {
    display: grid;
    gap: 20px;
  }
  .Learned_box {
    background: var(--c-surface);
    border-radius: var(--radius-sm);
    padding: 18px;
    border: 2px solid var(--c-ink);
  }
  .Learned_title {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 8px;
  }
  .Learned_list {
    padding-left: 1.2em;
    display: grid;
    gap: 8px;
    font-size: 0.92rem;
    line-height: 1.75;
  }
  .Learned_asOf {
    font-size: 0.75rem;
    color: var(--c-text-sub);
    margin-left: 4px;
  }
  .Questions {
    list-style: none;
    display: grid;
    gap: 10px;
  }
  .Questions li {
    background: var(--c-navy);
    color: #fff;
    border-radius: var(--radius-sm);
    padding: 14px 16px 14px 44px;
    position: relative;
    line-height: 1.7;
  }
  .Questions li::before {
    content: "Q";
    position: absolute;
    left: 16px;
    top: 13px;
    font-weight: 800;
    color: var(--c-accent);
  }
  ${sourceRefStyles}
`

const S = () => <Style id="Summary">{styles}</Style>

export const Points = ({ points }: { points: string[] }) => (
  <ol className="Points">
    <S />
    {points.map((p, i) => (
      <li key={i}>
        <span>{p}</span>
      </li>
    ))}
  </ol>
)

export const ProsCons = ({ summary }: { summary: Summary }) => (
  <div className="ProsCons">
    <S />
    <div className="ProsCons_col ProsCons_col--for">
      <h3 className="ProsCons_title">賛成・推進側の主な根拠</h3>
      <ul className="ProsCons_list">
        {summary.argumentsFor.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
    <div className="ProsCons_col ProsCons_col--against">
      <h3 className="ProsCons_title">慎重・反対側の主な根拠</h3>
      <ul className="ProsCons_list">
        {summary.argumentsAgainst.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  </div>
)

export const Impacts = ({
  parties,
}: {
  parties: Summary["affectedParties"]
}) => (
  <dl className="Impacts">
    <S />
    {parties.map((p, i) => (
      <div key={i} className="Impacts_row">
        <dt className="Impacts_who">{p.who}</dt>
        <dd className="Impacts_impact">{p.impact}</dd>
      </div>
    ))}
  </dl>
)

export const Learned = ({
  takeaways,
  summary,
  sources,
}: {
  takeaways: string[]
  summary: Summary
  sources: Source[]
}) => (
  <div className="Learned">
    <S />
    {takeaways.length > 0 && (
      <div className="Learned_box">
        <h3 className="Learned_title">ポイントのおさらい</h3>
        <ul className="Learned_list">
          {takeaways.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>
    )}
    {summary.knownFacts.length > 0 && (
      <div className="Learned_box">
        <h3 className="Learned_title">現時点で分かっている事実</h3>
        <ul className="Learned_list">
          {summary.knownFacts.map((f, i) => (
            <li key={i}>
              {f.text}
              <SourceRefs ids={f.sourceIds} sources={sources} />
              {f.asOf && (
                <span className="Learned_asOf">
                  （{formatDate(f.asOf)}時点）
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}
    {summary.openQuestions.length > 0 && (
      <div className="Learned_box">
        <h3 className="Learned_title">まだ結論が出ていない点</h3>
        <ul className="Learned_list">
          {summary.openQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

export const Questions = ({ questions }: { questions: string[] }) => (
  <ul className="Questions">
    <S />
    {questions.map((q, i) => (
      <li key={i}>{q}</li>
    ))}
  </ul>
)
