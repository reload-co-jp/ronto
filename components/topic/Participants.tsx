import { css, mq, Style } from "@/components/ui/Style"
import { Participant } from "@/lib/types"
import { participantPalette, PersonaIcon } from "./PersonaIcon"

export interface ParticipantColor {
  fg: string
  bg: string
  bubble: string
}

const MODERATOR_COLOR: ParticipantColor = {
  fg: "#2b2a33",
  bg: "#fff1c7",
  bubble: "#ffffff",
}

/** 登場人物の配色。聞き役（moderator）は黄色、それ以外は登場順にパレットから割り当てる */
export const colorsFor = (
  participants: Pick<Participant, "id" | "persona">[]
) => {
  const map = new Map<string, ParticipantColor>()
  let i = 0
  for (const p of participants) {
    if (p.persona === "moderator") map.set(p.id, MODERATOR_COLOR)
    else map.set(p.id, participantPalette[i++ % participantPalette.length])
  }
  return map
}

/** 表示名（ニックネームがあればニックネーム） */
export const displayName = (p: Pick<Participant, "nickname" | "name">) =>
  p.nickname ?? p.name

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
    border: 2px solid var(--c-ink);
    border-radius: var(--radius-sm);
    padding: 14px;
  }
  .Avatar {
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    border: 2px solid var(--c-ink);
    background: var(--c-surface);
  }
  .Participants_name {
    font-weight: 900;
    line-height: 1.4;
    font-size: 1.05rem;
  }
  .Participants_role {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    border: 1.5px solid var(--c-ink);
    border-radius: 999px;
    padding: 1px 8px;
    margin-left: 6px;
    vertical-align: 2px;
    background: var(--c-bg);
  }
  .Participants_profile {
    font-size: 0.8rem;
    color: var(--c-text-sub);
    line-height: 1.6;
    margin-top: 2px;
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
    border-radius: 999px;
    padding: 2px 8px;
    color: var(--c-text-sub);
  }
  .AiNotice {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 0.8rem;
    color: var(--c-text-sub);
    background: var(--c-surface);
    border: 2px dashed var(--c-border);
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
    <PersonaIcon name={participant.icon} size={Math.round(size * 0.52)} />
  </span>
)

export const AiNotice = () => (
  <p className="AiNotice">
    <Style id="Participants">{styles}</Style>
    <span aria-hidden="true">🤖</span>
    <span>
      <strong>登場人物はみんな、AIが演じる架空のキャラクターです。</strong>
      実在の専門家・政治家・政党・有権者の発言ではありません。それぞれの視点から論点を浮かび上がらせるための読み物として、事実に関わる部分は編集部が出典を確認しています。
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
              <p className="Participants_name">
                {displayName(p)}
                {p.nickname && (
                  <span className="Participants_role">{p.name}</span>
                )}
              </p>
              <p className="Participants_profile">
                {p.profile ?? p.description}
              </p>
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
