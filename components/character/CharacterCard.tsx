import Link from "next/link"
import { css, mq, Style } from "@/components/ui/Style"
import { PersonaIcon } from "@/components/topic/PersonaIcon"
import { characterPath } from "@/lib/characters"
import { Character } from "@/lib/types"

const styles = css`
  .CharacterGrid {
    list-style: none;
    display: grid;
    gap: 16px;
  }
  ${mq.tablet} {
    .CharacterGrid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  ${mq.desktop} {
    .CharacterGrid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  .CharacterCard {
    position: relative;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: transform 0.15s;
  }
  .CharacterCard:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 var(--c-ink);
  }
  .CharacterCard_visual {
    background: var(--ch-bg);
    border-bottom: 2px solid var(--c-ink);
    display: grid;
    place-items: center;
    padding: 12px 12px 0;
    aspect-ratio: 4 / 3;
  }
  .CharacterCard_visual img {
    width: 72%;
    max-width: 220px;
    height: auto;
    display: block;
    align-self: end;
  }
  .CharacterCard_body {
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .CharacterCard_species {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--ch-main);
  }
  .CharacterCard_name {
    font-size: 1.3rem;
    font-weight: 900;
    line-height: 1.3;
  }
  .CharacterCard_link {
    text-decoration: none;
    color: inherit;
  }
  .CharacterCard_link::after {
    content: "";
    position: absolute;
    inset: 0;
  }
  .CharacterCard_occupation {
    font-size: 0.78rem;
    color: var(--c-text-sub);
  }
  .CharacterCard_desc {
    font-size: 0.88rem;
    line-height: 1.75;
  }
  .CharacterCard_keywords {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .CharacterCard_keyword {
    font-size: 0.72rem;
    font-weight: 700;
    border: 1.5px solid var(--c-ink);
    border-radius: 999px;
    padding: 1px 9px;
    background: var(--ch-bg);
  }
  .CharacterCard_more {
    margin-top: auto;
    padding-top: 4px;
    font-size: 0.82rem;
    font-weight: 900;
    color: var(--ch-main);
  }
`

/** キャラクターの画像。画像が未登録なら線画アイコンで代替する */
export const CharacterVisual = ({
  character,
  src,
}: {
  character: Character
  src?: string | null
}) =>
  src ? (
    <img src={src} alt={`${character.name}（${character.species}）`} />
  ) : (
    <span role="img" aria-label={character.name} style={{ padding: 24 }}>
      <PersonaIcon name={character.fallbackIcon} size={72} />
    </span>
  )

export const characterVars = (c: Character) =>
  ({
    "--ch-main": c.color.main,
    "--ch-bg": c.color.bg,
    "--ch-bubble": c.color.bubble,
  }) as React.CSSProperties

export const CharacterCard = ({ character }: { character: Character }) => (
  <article className="CharacterCard" style={characterVars(character)}>
    <Style id="CharacterCard">{styles}</Style>
    <div className="CharacterCard_visual">
      <CharacterVisual
        character={character}
        src={character.expressionImages.happy ?? character.icon}
      />
    </div>
    <div className="CharacterCard_body">
      <p className="CharacterCard_species">{character.species}</p>
      <h3 className="CharacterCard_name">
        <Link className="CharacterCard_link" href={characterPath(character.id)}>
          {character.name}
        </Link>
      </h3>
      <p className="CharacterCard_occupation">{character.occupation}</p>
      <p className="CharacterCard_desc">{character.description}</p>
      <ul className="CharacterCard_keywords" aria-label="性格">
        {character.personality.map((k) => (
          <li key={k} className="CharacterCard_keyword">
            {k}
          </li>
        ))}
      </ul>
      <p className="CharacterCard_more" aria-hidden="true">
        プロフィールを見る →
      </p>
    </div>
  </article>
)

export const CharacterGrid = ({ characters }: { characters: Character[] }) => (
  <ul className="CharacterGrid">
    <Style id="CharacterCard">{styles}</Style>
    {characters.map((c) => (
      <li key={c.id}>
        <CharacterCard character={c} />
      </li>
    ))}
  </ul>
)

/** 職業はキャラクター設定である旨の注記 */
export const CharacterNotice = () => (
  <p
    style={{
      fontSize: "0.8rem",
      color: "var(--c-text-sub)",
      lineHeight: 1.7,
      marginTop: 20,
    }}
  >
    ※キャラクターはAIが演じる架空の存在です。職業や経歴はキャラクター設定であり、実在の専門家としての権威を示すものではありません。キャラクターの性格や役割は一貫させていますが、政治的な賛否はテーマごとに固定していません。
  </p>
)
