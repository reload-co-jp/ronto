import { css, mq, Style } from "@/components/ui/Style"
import { DiscussionItem, MESSAGE_KINDS, Participant, Source } from "@/lib/types"
import { MultilineText } from "./Blocks"
import { Avatar, colorsFor } from "./Participants"
import { sourceRefStyles, SourceRefs } from "./SourceRefs"

const styles = css`
  .Chat {
    background: var(--c-surface);
    border-radius: 20px;
    box-shadow: var(--shadow);
    overflow: hidden;
    border: 1px solid var(--c-border);
  }
  .Chat_header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--c-navy);
    color: #fff;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .Chat_avatars {
    display: flex;
    flex: none;
  }
  .Chat_avatars > * {
    margin-left: -8px;
    box-shadow: 0 0 0 2px var(--c-navy);
  }
  .Chat_avatars > *:first-child {
    margin-left: 0;
  }
  .Chat_title {
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .Chat_sub {
    font-size: 0.72rem;
    color: #b9c2d4;
    line-height: 1.5;
  }
  .Chat_body {
    list-style: none;
    display: grid;
    gap: 14px;
    padding: 20px 12px 28px;
    background: linear-gradient(180deg, #f6f2ea 0%, #faf8f4 100%);
  }
  ${mq.tablet} {
    .Chat_body {
      padding: 28px 28px 36px;
      gap: 16px;
    }
  }
  .Msg {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    max-width: 100%;
  }
  .Msg--right {
    flex-direction: row-reverse;
  }
  .Msg_main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    max-width: calc(100% - 48px);
  }
  .Msg--right .Msg_main {
    align-items: flex-end;
  }
  ${mq.tablet} {
    .Msg_main {
      max-width: min(34em, 80%);
    }
  }
  .Msg_meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 6px 4px;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .Msg--right .Msg_meta {
    flex-direction: row-reverse;
  }
  .Msg_kind {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid currentColor;
    opacity: 0.85;
  }
  .Msg_bubble {
    position: relative;
    background: var(--bubble-bg);
    color: var(--c-text);
    border-radius: 4px 18px 18px 18px;
    padding: 10px 14px;
    line-height: 1.85;
    font-size: 0.95rem;
    box-shadow: 0 1px 1px rgba(29, 36, 51, 0.06);
  }
  .Msg--right .Msg_bubble {
    border-radius: 18px 4px 18px 18px;
  }
  .Msg_bubble p + p {
    margin-top: 0.6em;
  }
  .Msg--center {
    justify-content: center;
  }
  .Msg--center .Msg_main {
    align-items: center;
    max-width: min(36em, 92%);
  }
  .Msg--center .Msg_bubble {
    background: #fff;
    border: 1px dashed #c9c3b8;
    border-radius: 14px;
    text-align: left;
  }
  .Chat_divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px 0 2px;
  }
  .Chat_divider span {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    background: var(--c-navy);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 999px;
    line-height: 1.4;
    text-align: center;
  }
  .Chat_divider small {
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    color: var(--c-accent);
  }
  .Chat_end {
    text-align: center;
    font-size: 0.78rem;
    color: var(--c-text-sub);
    padding-top: 8px;
  }
  ${sourceRefStyles}
`

type Side = "left" | "right" | "center"

/** 進行役は中央、それ以外は登場順に左右へ振り分ける */
const sidesFor = (participants: Participant[]) => {
  const map = new Map<string, Side>()
  let i = 0
  for (const p of participants)
    map.set(
      p.id,
      p.persona === "moderator" ? "center" : i++ % 2 ? "right" : "left"
    )
  return map
}

export const Discussion = ({
  items,
  participants,
  sources,
  title = "AIディスカッション",
}: {
  items: DiscussionItem[]
  participants: Participant[]
  sources: Source[]
  title?: string
}) => {
  const colors = colorsFor(participants)
  const sides = sidesFor(participants)
  const byId = new Map(participants.map((p) => [p.id, p]))
  let chapter = 0
  return (
    <div className="Chat">
      <Style id="Discussion">{styles}</Style>
      <div className="Chat_header">
        <div className="Chat_avatars" aria-hidden="true">
          {participants.map((p) => (
            <Avatar
              key={p.id}
              participant={p}
              color={colors.get(p.id)!}
              size={32}
            />
          ))}
        </div>
        <div>
          <p className="Chat_title">{title}</p>
          <p className="Chat_sub">
            {participants.length}人で議論中・AIが演じる架空の役割です
          </p>
        </div>
      </div>
      <ol className="Chat_body" aria-label="ディスカッション">
        {items.map((item, i) => {
          if ("divider" in item) {
            chapter++
            return (
              <li key={i} className="Chat_divider">
                <span>
                  <small>TOPIC {chapter}</small>
                  {item.divider}
                </span>
              </li>
            )
          }
          const p = byId.get(item.speaker)!
          const color = colors.get(p.id)!
          const side = sides.get(p.id)!
          const paragraphs = item.text.split(/\n{2,}/)
          return (
            <li
              key={i}
              className={`Msg Msg--${side}`}
              style={{ "--bubble-bg": color.bg } as React.CSSProperties}
            >
              {side !== "center" && (
                <Avatar participant={p} color={color} size={40} />
              )}
              <div className="Msg_main">
                <p className="Msg_meta" style={{ color: color.fg }}>
                  {side === "center" && (
                    <Avatar participant={p} color={color} size={22} />
                  )}
                  <span>{p.name}</span>
                  {item.kind && (
                    <span className="Msg_kind">{MESSAGE_KINDS[item.kind]}</span>
                  )}
                </p>
                <div className="Msg_bubble">
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
        <li className="Chat_end">— ディスカッションはここまで —</li>
      </ol>
    </div>
  )
}
