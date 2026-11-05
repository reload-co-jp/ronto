import Link from "next/link"
import { css, mq, Style } from "@/components/ui/Style"
import { characterImage, characterPath, getCharacter } from "@/lib/characters"
import { CharacterExpression, Participant } from "@/lib/types"
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

type ParticipantRef = Pick<Participant, "id" | "persona" | "character">

/** 聞き役か（標準の進行役、または聞き役のキャラクター） */
export const isModerator = (p: Pick<Participant, "persona" | "character">) =>
  p.persona === "moderator" ||
  getCharacter(p.character)?.chatRole === "moderator"

/**
 * 登場人物の配色。公式キャラクターは固有の色、聞き役（moderator）は黄色、
 * それ以外は登場順にパレットから割り当てる
 */
export const colorsFor = (participants: ParticipantRef[]) => {
  const map = new Map<string, ParticipantColor>()
  let i = 0
  for (const p of participants) {
    const c = getCharacter(p.character)
    if (c)
      map.set(p.id, { fg: "#2b2a33", bg: c.color.bg, bubble: c.color.bubble })
    else if (p.persona === "moderator") map.set(p.id, MODERATOR_COLOR)
    else map.set(p.id, participantPalette[i++ % participantPalette.length])
  }
  return map
}

/** 公式キャラクターならプロフィールページのパス */
export const profilePathOf = (p: Pick<Participant, "character">) =>
  getCharacter(p.character) ? characterPath(p.character!) : null

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
    overflow: hidden;
  }
  .Avatar_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .Participants_link {
    color: inherit;
    text-decoration: none;
  }
  .Participants_link:hover {
    text-decoration: underline;
  }
  .Participants_more {
    display: inline-block;
    margin-top: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--c-accent);
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

/**
 * 登場人物のアバター。公式キャラクターはイラスト（表情つき）を表示し、
 * キャラクターが未登録・画像がない場合は線画アイコンにフォールバックする
 */
export const Avatar = ({
  participant,
  color,
  size = 44,
  expression,
}: {
  participant: Pick<Participant, "icon" | "character">
  color: { fg: string; bg: string }
  size?: number
  expression?: CharacterExpression
}) => {
  const character = getCharacter(participant.character)
  const src = character ? characterImage(character, expression) : null
  return (
    <span
      className="Avatar"
      style={{
        background: color.bg,
        color: color.fg,
        width: size,
        height: size,
      }}
    >
      <Style id="Participants">{styles}</Style>
      {src ? (
        <img
          className="Avatar_img"
          src={src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <PersonaIcon
          name={character?.fallbackIcon ?? participant.icon}
          size={Math.round(size * 0.52)}
        />
      )}
    </span>
  )
}

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
        {participants.map((p) => {
          const href = profilePathOf(p)
          return (
            <li key={p.id} className="Participants_item">
              <Avatar participant={p} color={colors.get(p.id)!} />
              <div>
                <p className="Participants_name">
                  {href ? (
                    <Link className="Participants_link" href={href}>
                      {displayName(p)}
                    </Link>
                  ) : (
                    displayName(p)
                  )}
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
                {href && (
                  <Link className="Participants_more" href={href}>
                    {displayName(p)}のプロフィール →
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <AiNotice />
    </>
  )
}
