import { css, mq, Style } from "@/components/ui/Style"
import { DiscussionItem, Participant, Source } from "@/lib/types"
import { MultilineText } from "./Blocks"
import { Avatar, colorsFor } from "./Participants"
import { sourceRefStyles, SourceRefs } from "./SourceRefs"

const styles = css`
  .Discussion {
    list-style: none;
    display: grid;
    gap: 18px;
  }
  .Discussion_turn {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 10px;
    align-items: start;
  }
  .Discussion_turn--moderator .Discussion_bubble {
    background: var(--c-navy-soft);
    border-color: transparent;
  }
  .Discussion_name {
    font-size: 0.75rem;
    font-weight: 700;
    margin-bottom: 4px;
    display: block;
  }
  .Discussion_bubble {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: 4px 16px 16px 16px;
    padding: 12px 16px;
    line-height: 1.85;
    font-size: 0.95rem;
  }
  .Discussion_bubble p + p {
    margin-top: 0.7em;
  }
  .Discussion_divider {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--c-navy);
    margin: 10px 0 0;
  }
  .Discussion_divider::before,
  .Discussion_divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--c-border);
  }
  ${mq.tablet} {
    .Discussion_turn {
      grid-template-columns: 48px 1fr;
      gap: 14px;
    }
    .Discussion_bubble {
      max-width: 36em;
    }
  }
  ${sourceRefStyles}
`

export const Discussion = ({
  items,
  participants,
  sources,
}: {
  items: DiscussionItem[]
  participants: Participant[]
  sources: Source[]
}) => {
  const colors = colorsFor(participants)
  const byId = new Map(participants.map((p) => [p.id, p]))
  return (
    <ol className="Discussion" aria-label="ディスカッション">
      <Style id="Discussion">{styles}</Style>
      {items.map((item, i) => {
        if ("divider" in item)
          return (
            <li key={i} className="Discussion_divider">
              {item.divider}
            </li>
          )
        const p = byId.get(item.speaker)!
        const color = colors.get(p.id)!
        const paragraphs = item.text.split(/\n{2,}/)
        return (
          <li
            key={i}
            className={`Discussion_turn${p.persona === "moderator" ? " Discussion_turn--moderator" : ""}`}
          >
            <Avatar participant={p} color={color} size={40} />
            <div>
              <span className="Discussion_name" style={{ color: color.fg }}>
                {p.name}
              </span>
              <div className="Discussion_bubble">
                {paragraphs.map((t, j) => (
                  <p key={j}>
                    <MultilineText text={t} />
                    {j === paragraphs.length - 1 && (
                      <SourceRefs ids={item.sourceIds} sources={sources} />
                    )}
                  </p>
                ))}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
