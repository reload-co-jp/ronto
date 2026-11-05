import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  CharacterNotice,
  CharacterVisual,
  characterVars,
} from "@/components/character/CharacterCard"
import { TopicGrid } from "@/components/topic/TopicCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, JsonLd } from "@/components/ui/primitives"
import { css, mq, Style } from "@/components/ui/Style"
import {
  characterImage,
  characterPath,
  characters,
  getCharacter,
} from "@/lib/characters"
import { getTopicsByCharacter, toCardData } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"
import { CHARACTER_EXPRESSIONS, CharacterExpression } from "@/lib/types"

export const dynamicParams = false
export const generateStaticParams = () => characters.map((c) => ({ id: c.id }))

type Props = { params: Promise<{ id: string }> }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const c = getCharacter((await params).id)
  if (!c) return {}
  return pageMetadata({
    title: `${c.name}（${c.species}）のプロフィール`,
    description: `${c.tagline}。${c.description}`,
    path: characterPath(c.id),
  })
}

const expressionLabels: Record<CharacterExpression, string> = {
  normal: "ふつう",
  happy: "うれしい",
  surprised: "おどろき",
  confused: "こまった",
  thinking: "考え中",
  serious: "真剣",
}

const styles = css`
  .Profile {
    padding-bottom: 64px;
  }
  .Profile_hero {
    margin-top: 20px;
    display: grid;
    gap: 20px;
    align-items: center;
    background: var(--ch-bg);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 20px;
  }
  ${mq.tablet} {
    .Profile_hero {
      grid-template-columns: 240px 1fr;
      gap: 32px;
      padding: 28px 32px;
    }
  }
  .Profile_visual img {
    display: block;
    width: 100%;
    max-width: 240px;
    height: auto;
    margin: 0 auto;
  }
  .Profile_species {
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: var(--ch-main);
  }
  .Profile_name {
    font-size: 2rem;
    font-weight: 900;
    line-height: 1.3;
    margin-top: 2px;
  }
  ${mq.tablet} {
    .Profile_name {
      font-size: 2.4rem;
    }
  }
  .Profile_tagline {
    font-weight: 900;
    font-size: 1.05rem;
    line-height: 1.6;
    margin-top: 8px;
  }
  .Profile_desc {
    margin-top: 10px;
    font-size: 0.92rem;
    line-height: 1.85;
    color: #4a4650;
  }
  .Profile_section {
    margin-top: 40px;
  }
  .Profile_h2 {
    font-size: 1.25rem;
    font-weight: 900;
    line-height: 1.5;
    margin-bottom: 14px;
    padding-left: 12px;
    border-left: 6px solid var(--ch-main);
  }
  .Profile_box {
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius-sm);
    padding: 16px 18px;
    line-height: 1.85;
  }
  .Profile_dl {
    display: grid;
    grid-template-columns: 6em 1fr;
    gap: 8px 12px;
  }
  .Profile_dl dt {
    font-weight: 900;
    font-size: 0.85rem;
    color: var(--c-text-sub);
  }
  .Profile_dl dd {
    margin: 0;
  }
  .Profile_tags {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .Profile_tag {
    font-size: 0.82rem;
    font-weight: 700;
    border: 1.5px solid var(--c-ink);
    border-radius: 999px;
    padding: 2px 12px;
    background: var(--ch-bg);
  }
  .Profile_tags + p {
    margin-top: 12px;
  }
  .Profile_cols {
    display: grid;
    gap: 12px;
  }
  ${mq.tablet} {
    .Profile_cols {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .Profile_colTitle {
    font-weight: 900;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  .Profile_list {
    padding-left: 1.2em;
    font-size: 0.92rem;
  }
  .Profile_quote {
    position: relative;
    background: var(--ch-bubble);
    border: 2px solid var(--c-ink);
    border-radius: 6px 22px 22px 22px;
    padding: 14px 20px;
    font-size: 1.1rem;
    font-weight: 900;
    line-height: 1.7;
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .Profile_quote img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--c-ink);
    background: var(--ch-bg);
    flex: none;
  }
  .Profile_faces {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 14px;
  }
  ${mq.tablet} {
    .Profile_faces {
      grid-template-columns: repeat(6, 1fr);
    }
  }
  .Profile_face {
    background: var(--ch-bg);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius-sm);
    text-align: center;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 6px 4px 4px;
  }
  .Profile_face img {
    display: block;
    width: 100%;
    height: auto;
  }
  .Profile_rels {
    list-style: none;
    display: grid;
    gap: 12px;
  }
  .Profile_rel {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 12px;
    align-items: start;
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
  }
  .Profile_rel img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--c-ink);
  }
  .Profile_relName {
    font-weight: 900;
  }
  .Profile_relLabel {
    display: inline-block;
    margin-left: 8px;
    font-size: 0.7rem;
    font-weight: 700;
    border: 1.5px solid var(--c-ink);
    border-radius: 999px;
    padding: 0 8px;
    vertical-align: 2px;
  }
  .Profile_relDesc {
    font-size: 0.88rem;
    line-height: 1.75;
    margin-top: 2px;
  }
  .Profile_empty {
    background: var(--c-surface);
    border: 2px dashed var(--c-border);
    border-radius: var(--radius-sm);
    padding: 24px;
    color: var(--c-text-sub);
    text-align: center;
    font-size: 0.9rem;
  }
  .Profile_others {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 40px;
  }
  .Profile_others a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    font-weight: 700;
    font-size: 0.85rem;
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    padding: 2px 14px 2px 4px;
    background: var(--c-surface);
  }
  .Profile_others img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
`

const CharacterPage = async ({ params }: Props) => {
  const c = getCharacter((await params).id)
  if (!c) notFound()
  const topics = getTopicsByCharacter(c.id).map(toCardData)
  const icon = characterImage(c)
  const faces = CHARACTER_EXPRESSIONS.filter((e) => c.expressionImages[e])

  return (
    <Container narrow>
      <Style id="CharacterPage">{styles}</Style>
      <Breadcrumbs
        items={[
          { name: "キャラクター", href: "/characters/" },
          { name: c.name, href: characterPath(c.id) },
        ]}
      />
      <article className="Profile" style={characterVars(c)}>
        {/* 1. メインビジュアル / 2. 名前・キャッチコピー */}
        <header className="Profile_hero">
          <div className="Profile_visual">
            <CharacterVisual character={c} src={c.profileImage ?? icon} />
          </div>
          <div>
            <p className="Profile_species">{c.species}</p>
            <h1 className="Profile_name">{c.name}</h1>
            <p className="Profile_tagline">{c.tagline}</p>
            <p className="Profile_desc">{c.description}</p>
          </div>
        </header>

        {/* 3. 基本プロフィール */}
        <section className="Profile_section" aria-labelledby="basic">
          <h2 className="Profile_h2" id="basic">
            基本プロフィール
          </h2>
          <dl className="Profile_box Profile_dl">
            <dt>名前</dt>
            <dd>{c.name}</dd>
            <dt>種類</dt>
            <dd>{c.species}</dd>
            <dt>職業</dt>
            <dd>{c.occupation}</dd>
            <dt>議論での役割</dt>
            <dd>{c.role}</dd>
          </dl>
        </section>

        {/* 4. 性格 */}
        <section className="Profile_section" aria-labelledby="personality">
          <h2 className="Profile_h2" id="personality">
            性格
          </h2>
          <div className="Profile_box">
            <ul className="Profile_tags">
              {c.personality.map((k) => (
                <li key={k} className="Profile_tag">
                  {k}
                </li>
              ))}
            </ul>
            <p>{c.personalityDetail}</p>
          </div>
          {faces.length > 0 && (
            <ul className="Profile_faces" aria-label="表情のバリエーション">
              {faces.map((e) => (
                <li key={e} className="Profile_face">
                  <img
                    src={c.expressionImages[e]}
                    alt=""
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                  {expressionLabels[e]}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 5. 職業 */}
        <section className="Profile_section" aria-labelledby="occupation">
          <h2 className="Profile_h2" id="occupation">
            職業
          </h2>
          <div className="Profile_box">
            <p>
              <strong>{c.occupation}</strong>
            </p>
            <p>{c.occupationDetail}</p>
          </div>
        </section>

        {/* 6. 趣味・好きなこと・苦手なこと */}
        <section className="Profile_section" aria-labelledby="likes">
          <h2 className="Profile_h2" id="likes">
            趣味・好きなこと・苦手なこと
          </h2>
          <div className="Profile_cols">
            {[
              { title: "趣味", items: c.hobbies },
              { title: "好きなこと", items: c.likes },
              { title: "苦手なこと", items: c.dislikes },
            ].map((col) => (
              <div key={col.title} className="Profile_box">
                <p className="Profile_colTitle">{col.title}</p>
                <ul className="Profile_list">
                  {col.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 7. 得意な話題 */}
        <section className="Profile_section" aria-labelledby="specialties">
          <h2 className="Profile_h2" id="specialties">
            得意な話題
          </h2>
          <ul className="Profile_tags">
            {c.specialties.map((k) => (
              <li key={k} className="Profile_tag">
                {k}
              </li>
            ))}
          </ul>
        </section>

        {/* 8. 口癖 */}
        <section className="Profile_section" aria-labelledby="catchphrase">
          <h2 className="Profile_h2" id="catchphrase">
            口癖
          </h2>
          <p className="Profile_quote">
            {icon && <img src={icon} alt="" width={56} height={56} />}
            <span>「{c.catchphrase}」</span>
          </p>
        </section>

        {/* 9. 他のキャラクターとの関係 */}
        {c.relationships.length > 0 && (
          <section className="Profile_section" aria-labelledby="relationships">
            <h2 className="Profile_h2" id="relationships">
              ほかのキャラクターとの関係
            </h2>
            <ul className="Profile_rels">
              {c.relationships.map((r) => {
                const other = getCharacter(r.characterId)!
                const otherIcon = characterImage(other)
                return (
                  <li
                    key={r.characterId}
                    className="Profile_rel"
                    style={{ background: other.color.bubble }}
                  >
                    {otherIcon ? (
                      <img
                        src={otherIcon}
                        alt=""
                        width={56}
                        height={56}
                        style={{ background: other.color.bg }}
                      />
                    ) : (
                      <span />
                    )}
                    <div>
                      <p>
                        <Link
                          className="Profile_relName"
                          href={characterPath(other.id)}
                        >
                          {other.name}
                        </Link>
                        <span className="Profile_relLabel">{r.label}</span>
                      </p>
                      <p className="Profile_relDesc">{r.description}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* 10. 登場記事一覧（記事データから自動生成） */}
        <section className="Profile_section" aria-labelledby="appearances">
          <h2 className="Profile_h2" id="appearances">
            {c.name}が登場する記事
          </h2>
          {topics.length > 0 ? (
            <TopicGrid topics={topics} columns={2} />
          ) : (
            <p className="Profile_empty">
              {c.name}が登場する記事は準備中です。
              <Link href="/topics/">ほかのトピック</Link>もご覧ください。
            </p>
          )}
        </section>

        <CharacterNotice />

        <nav aria-label="ほかのキャラクター">
          <ul className="Profile_others">
            {characters
              .filter((o) => o.id !== c.id)
              .map((o) => {
                const src = characterImage(o)
                return (
                  <li key={o.id}>
                    <Link href={characterPath(o.id)}>
                      {src && (
                        <img
                          src={src}
                          alt=""
                          width={28}
                          height={28}
                          style={{ background: o.color.bg }}
                        />
                      )}
                      {o.name}
                    </Link>
                  </li>
                )
              })}
            <li>
              <Link href="/characters/">キャラクター一覧</Link>
            </li>
          </ul>
        </nav>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl(characterPath(c.id)),
          mainEntity: {
            "@type": "Thing",
            name: c.name,
            description: c.description,
            image: c.profileImage ? absoluteUrl(c.profileImage) : undefined,
          },
        }}
      />
    </Container>
  )
}

export default CharacterPage
