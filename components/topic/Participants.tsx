import { css, mq, Style } from "@/components/ui/Style"
import { Participant } from "@/lib/types"
import { participantPalette, PersonaIcon } from "./PersonaIcon"

/** 登場人物の配色。進行役はグレー、それ以外は登場順にパレットから割り当てる */
export const colorsFor = (
  participants: Pick<Participant, "id" | "persona">[]
) => {
  const map = new Map<string, { fg: string; bg: string }>()
  let i = 0
  for (const p of participants) {
    if (p.persona === "moderator")
      map.set(p.id, { fg: "#4a5162", bg: "#eceae5" })
    else map.set(p.id, participantPalette[i++ % participantPalette.length])
  }
  return map
}

const styles = css`
  .Participants {
    display: grid;
    gap: 12px;
    list-style: none;
  }
  ${mq.tablet} {
    .Participants {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .Participants_item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: start;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-sm);
    padding: 14px;
  }
  .Avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
  }
  .Participants_name {
    font-weight: 700;
    line-height: 1.5;
  }
  .Participants_desc {
    font-size: 0.85rem;
    color: var(--c-text-sub);
    line-height: 1.7;
  }
  .Participants_stance {
    font-size: 0.85rem;
    margin-top: 6px;
    line-height: 1.7;
  }
  .Participants_tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
    list-style: none;
  }
  .Participants_tag {
    font-size: 0.7rem;
    background: var(--c-surface-alt);
    border-radius: 4px;
    padding: 2px 6px;
    color: var(--c-text-sub);
  }
  .AiNotice {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 0.8rem;
    color: var(--c-text-sub);
    background: var(--c-surface-alt);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    margin-top: 16px;
    line-height: 1.7;
  }
  .AiNotice strong {
    color: var(--c-text);
  }
`

export const Avatar = ({
  participant,
  color,
  size = 44,
}: {
  participant: Pick<Participant, "icon">
  color: { fg: string; bg: string }
  size?: number
}) => (
  <span
    className="Avatar"
    style={{ background: color.bg, color: color.fg, width: size, height: size }}
  >
    <Style id="Participants">{styles}</Style>
    <PersonaIcon name={participant.icon} size={Math.round(size * 0.5)} />
  </span>
)

export const AiNotice = () => (
  <p className="AiNotice">
    <Style id="Participants">{styles}</Style>
    <span aria-hidden="true">ⓘ</span>
    <span>
      <strong>登場人物はAIが演じる架空の役割です。</strong>
      実在の専門家・政治家・政党・有権者の発言ではありません。それぞれの視点から論点を浮かび上がらせるための読み物として、編集部が内容を確認しています。
    </span>
  </p>
)

export const Participants = ({
  participants,
}: {
  participants: Participant[]
}) => {
  const colors = colorsFor(participants)
  return (
    <>
      <ul className="Participants">
        <Style id="Participants">{styles}</Style>
        {participants.map((p) => (
          <li key={p.id} className="Participants_item">
            <Avatar participant={p} color={colors.get(p.id)!} />
            <div>
              <p className="Participants_name">{p.name}</p>
              <p className="Participants_desc">{p.description}</p>
              <p className="Participants_stance">{p.stance}</p>
              {p.concerns.length > 0 && (
                <ul className="Participants_tags" aria-label="関心事項">
                  {p.concerns.map((c) => (
                    <li key={c} className="Participants_tag">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      <AiNotice />
    </>
  )
}
