import { css, mq, Style } from "@/components/ui/Style"
import {
  DiscussionItem,
  MESSAGE_KINDS,
  Participant,
  Scene,
  Source,
} from "@/lib/types"
import { MultilineText } from "./Blocks"
import { Avatar, colorsFor, displayName } from "./Participants"
import { sourceRefStyles, SourceRefs } from "./SourceRefs"

const styles = css`
  .Chat {
    background: #fdf3e1;
    border-radius: 26px;
    border: 2px solid var(--c-ink);
    box-shadow: 6px 6px 0 var(--c-ink);
    overflow: hidden;
  }
  .Chat_header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--c-ink);
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
  }
  .Chat_avatars > *:first-child {
    margin-left: 0;
  }
  .Chat_title {
    font-weight: 900;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  .Chat_sub {
    font-size: 0.72rem;
    color: #cfc8bd;
    line-height: 1.5;
  }
  .Scene {
    position: relative;
    margin: 22px 14px 6px;
    background: #fffdf7;
    border: 2px solid var(--c-ink);
    border-radius: 6px;
    padding: 18px 18px 16px;
    transform: rotate(-0.8deg);
    box-shadow: 3px 3px 0 rgba(43, 42, 51, 0.15);
  }
  .Scene::before {
    content: "";
    position: absolute;
    top: -12px;
    left: 50%;
    width: 88px;
    height: 22px;
    margin-left: -44px;
    background: rgba(255, 201, 74, 0.85);
    transform: rotate(2deg);
    border-radius: 2px;
  }
  .Scene_label {
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 0.16em;
    color: var(--c-accent);
  }
  .Scene_where {
    font-weight: 900;
    font-size: 1.05rem;
    line-height: 1.5;
    margin-top: 2px;
  }
  .Scene_emoji {
    margin-right: 6px;
  }
  .Scene_time {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--c-yellow-soft);
    border-radius: 999px;
    padding: 1px 10px;
    margin-left: 4px;
    vertical-align: 2px;
  }
  .Scene_desc {
    margin-top: 8px;
    font-size: 0.88rem;
    line-height: 1.85;
    color: #4a4650;
  }
  .Chat_body {
    list-style: none;
    display: grid;
    gap: 14px;
    padding: 20px 12px 28px;
  }
  ${mq.tablet} {
    .Scene {
      margin: 28px 28px 8px;
      padding: 20px 24px;
    }
    .Chat_body {
      padding: 24px 28px 36px;
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
    max-width: calc(100% - 50px);
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
    align-items: baseline;
    gap: 6px;
    margin: 0 6px 4px;
    font-size: 0.78rem;
    font-weight: 900;
  }
  .Msg--right .Msg_meta {
    flex-direction: row-reverse;
  }
  .Msg_role {
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--c-text-sub);
  }
  .Msg_kind {
    font-size: 0.62rem;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: 999px;
    background: var(--c-ink);
    color: #fff;
  }
  .Msg_bubble {
    position: relative;
    background: var(--bubble-bg);
    color: var(--c-text);
    border: 2px solid var(--c-ink);
    border-radius: 6px 20px 20px 20px;
    padding: 9px 14px;
    line-height: 1.85;
    font-size: 0.95rem;
  }
  .Msg--right .Msg_bubble {
    border-radius: 20px 6px 20px 20px;
  }
  .Msg_bubble p + p {
    margin-top: 0.6em;
  }
  .Chat_divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 14px 0 2px;
  }
  .Chat_divider span {
    display: inline-flex;
    gap: 8px;
    align-items: baseline;
    background: var(--c-yellow);
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    font-size: 0.82rem;
    font-weight: 900;
    padding: 4px 14px;
    border-radius: 999px;
    line-height: 1.4;
    text-align: center;
    transform: rotate(-1deg);
  }
  .Chat_divider small {
    font-size: 0.62rem;
    letter-spacing: 0.12em;
  }
  .Chat_narration {
    text-align: center;
    font-size: 0.8rem;
    color: #7a7270;
    line-height: 1.7;
    padding: 0 8%;
  }
  .Chat_narration span {
    display: inline-block;
    border-bottom: 1.5px dashed #c9bda8;
    padding-bottom: 2px;
  }
  .Chat_end {
    text-align: center;
    font-size: 0.78rem;
    color: var(--c-text-sub);
    padding-top: 8px;
    font-weight: 700;
  }
  ${sourceRefStyles}
`

type Side = "left" | "right"

/** 聞き役（moderator）は左、ほかの登場人物は登場順に右・左…と振り分ける */
const sidesFor = (participants: Participant[]) => {
  const map = new Map<string, Side>()
  let i = 0
  for (const p of participants)
    map.set(
      p.id,
      p.persona === "moderator" ? "left" : i++ % 2 ? "left" : "right"
    )
  return map
}

export const SceneCard = ({ scene }: { scene: Scene }) => (
  <div className="Scene">
    <Style id="Discussion">{styles}</Style>
    <p className="Scene_label">TODAY&apos;S SCENE</p>
    <p className="Scene_where">
      {scene.emoji && (
        <span className="Scene_emoji" aria-hidden="true">
          {scene.emoji}
        </span>
      )}
      {scene.place}
      <span className="Scene_time">{scene.time}</span>
    </p>
    <p className="Scene_desc">{scene.description}</p>
  </div>
)

export const Discussion = ({
  items,
  participants,
  sources,
  scene,
  title = "AIディスカッション",
}: {
  items: DiscussionItem[]
  participants: Participant[]
  sources: Source[]
  scene?: Scene
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
            {participants.map((p) => displayName(p)).join("・")}
            （AIが演じる架空のキャラクター）
          </p>
        </div>
      </div>
      {scene && <SceneCard scene={scene} />}
      <ol className="Chat_body" aria-label="会話">
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
          if ("narration" in item)
            return (
              <li key={i} className="Chat_narration">
                <span>{item.narration}</span>
              </li>
            )
          const p = byId.get(item.speaker)!
          const color = colors.get(p.id)!
          const side = sides.get(p.id)!
          const paragraphs = item.text.split(/\n{2,}/)
          return (
            <li
              key={i}
              className={`Msg Msg--${side}`}
              style={{ "--bubble-bg": color.bubble } as React.CSSProperties}
            >
              <Avatar participant={p} color={color} size={42} />
              <div className="Msg_main">
                <p className="Msg_meta">
                  <span>{displayName(p)}</span>
                  {p.nickname && <span className="Msg_role">{p.name}</span>}
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
        <li className="Chat_end">― おしまい。このあとポイントを整理します ―</li>
      </ol>
    </div>
  )
}
