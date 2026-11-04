import Link from "next/link"
import { Avatar, colorsFor, displayName } from "@/components/topic/Participants"
import { TopicCard, TopicGrid } from "@/components/topic/TopicCard"
import { Container, Section, SectionHeading } from "@/components/ui/primitives"
import { css, mq, Style } from "@/components/ui/Style"
import {
  articleTypes,
  categories,
  getFeaturedTopics,
  getTopicsByCategory,
  getVisibleTopics,
  toCardData,
  topicPath,
} from "@/lib/content"
import { site } from "@/lib/site"
import { DiscussionMessage, Topic } from "@/lib/types"

const typeEmoji: Record<string, string> = {
  why: "🤔",
  discussion: "🗣️",
  benefit: "💰",
  comparison: "⚖️",
  election: "🗳️",
}

const styles = css`
  .Hero {
    position: relative;
    overflow: hidden;
    padding: 40px 0 48px;
    border-bottom: 2px solid var(--c-ink);
    background: linear-gradient(180deg, #fff3dc 0%, var(--c-bg) 100%);
  }
  .Hero_grid {
    display: grid;
    gap: 40px;
    align-items: center;
  }
  ${mq.desktop} {
    .Hero_grid {
      grid-template-columns: 1.05fr 1fr;
      gap: 56px;
    }
  }
  .Hero_inner {
    position: relative;
    z-index: 1;
  }
  .Hero_concept {
    display: inline-block;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--c-ink);
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    padding: 3px 14px;
  }
  .Hero_title {
    font-size: 1.85rem;
    line-height: 1.5;
    margin-top: 18px;
    letter-spacing: 0.04em;
    font-weight: 900;
  }
  .Hero_line {
    display: inline-block;
  }
  .Hero_title em {
    font-style: normal;
    color: var(--c-ink);
    background: linear-gradient(
      transparent 58%,
      var(--c-yellow) 58%,
      var(--c-yellow) 92%,
      transparent 92%
    );
    padding: 0 2px;
  }
  .Hero_lead {
    margin-top: 16px;
    color: var(--c-text-sub);
    max-width: 32em;
  }
  .Hero_actions {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .Button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    padding: 11px 22px;
    font-weight: 900;
    text-decoration: none;
    font-size: 0.95rem;
    border: 2px solid var(--c-ink);
    box-shadow: 3px 3px 0 var(--c-ink);
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease;
  }
  .Button:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 var(--c-ink);
  }
  .Button--primary {
    background: var(--c-accent);
    color: #fff;
  }
  .Button--ghost {
    background: var(--c-surface);
    color: var(--c-ink);
  }
  .Hero_deco {
    position: absolute;
    pointer-events: none;
  }
  ${mq.tablet} {
    .Hero {
      padding: 72px 0 80px;
    }
    .Hero_title {
      font-size: 2.55rem;
      letter-spacing: 0.02em;
    }
  }
  .HeroChat {
    position: relative;
    z-index: 1;
    display: block;
    text-decoration: none;
    background: #fdf3e1;
    border: 2px solid var(--c-ink);
    border-radius: 26px;
    box-shadow: 7px 7px 0 var(--c-ink);
    overflow: hidden;
    transform: rotate(1.2deg);
    transition: transform 0.15s ease;
  }
  .HeroChat:hover {
    transform: rotate(0deg) translateY(-2px);
  }
  .HeroChat_head {
    background: var(--c-ink);
    color: #fff;
    padding: 12px 16px;
    font-size: 0.9rem;
    font-weight: 900;
    line-height: 1.5;
  }
  .HeroChat_head small {
    display: block;
    color: var(--c-yellow);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    font-weight: 700;
  }
  .HeroChat_body {
    list-style: none;
    display: grid;
    gap: 10px;
    padding: 16px;
  }
  .HeroChat_msg {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  .HeroChat_msg--right {
    flex-direction: row-reverse;
  }
  .HeroChat_bubble {
    background: var(--bubble-bg);
    border: 2px solid var(--c-ink);
    border-radius: 6px 16px 16px 16px;
    padding: 7px 12px;
    font-size: 0.84rem;
    line-height: 1.7;
    max-width: 80%;
  }
  .HeroChat_msg--right .HeroChat_bubble {
    border-radius: 16px 6px 16px 16px;
  }
  .HeroChat_name {
    display: block;
    font-size: 0.68rem;
    font-weight: 900;
  }
  .HeroChat_text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .HeroChat_more {
    text-align: center;
    font-size: 0.85rem;
    font-weight: 900;
    color: var(--c-accent);
    padding: 10px;
    border-top: 2px dashed #e3d3b8;
  }
  .Featured {
    display: grid;
    gap: 28px;
    list-style: none;
  }
  ${mq.desktop} {
    .Featured {
      grid-template-columns: 1.4fr 1fr;
    }
    .Featured > li:first-child {
      grid-row: span 2;
    }
  }
  .Categories {
    list-style: none;
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(2, 1fr);
  }
  ${mq.desktop} {
    .Categories {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .Categories_link {
    display: block;
    height: 100%;
    text-decoration: none;
    background: color-mix(in srgb, var(--cat-color) 16%, #fff);
    border-radius: var(--radius);
    padding: 18px;
    border: 2px solid var(--c-ink);
    box-shadow: 3px 3px 0 var(--c-ink);
    transition: transform 0.12s ease;
  }
  .Categories_link:hover {
    transform: translate(-1px, -2px) rotate(-0.6deg);
  }
  .Categories_name {
    font-weight: 900;
    font-size: 1.05rem;
  }
  .Categories_desc {
    font-size: 0.8rem;
    color: var(--c-text-sub);
    margin-top: 4px;
    line-height: 1.6;
  }
  .Categories_count {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 700;
    margin-top: 10px;
    background: var(--c-surface);
    border: 1.5px solid var(--c-ink);
    border-radius: 999px;
    padding: 1px 10px;
  }
  .Types {
    list-style: none;
    display: grid;
    gap: 12px;
  }
  ${mq.tablet} {
    .Types {
      grid-template-columns: repeat(5, 1fr);
    }
  }
  .Types_link {
    display: flex;
    gap: 12px;
    align-items: center;
    height: 100%;
    text-decoration: none;
    border: 2px solid var(--c-ink);
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 14px 16px;
    transition: background 0.12s ease;
  }
  ${mq.tablet} {
    .Types_link {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .Types_link:hover {
    background: var(--c-yellow-soft);
  }
  .Types_emoji {
    font-size: 1.8rem;
    line-height: 1;
  }
  .Types_label {
    font-size: 1.1rem;
    font-weight: 900;
    display: block;
  }
  .Types_desc {
    font-size: 0.78rem;
    color: var(--c-text-sub);
    line-height: 1.6;
  }
  .HowTo {
    background: var(--c-yellow);
    border: 2px solid var(--c-ink);
    box-shadow: 6px 6px 0 var(--c-ink);
    border-radius: 28px;
    padding: 28px 22px;
    display: grid;
    gap: 18px;
  }
  ${mq.tablet} {
    .HowTo {
      grid-template-columns: 1fr 2fr;
      padding: 40px;
      gap: 32px;
    }
  }
  .HowTo_title {
    font-size: 1.4rem;
    line-height: 1.5;
    font-weight: 900;
  }
  .HowTo_list {
    list-style: none;
    display: grid;
    gap: 12px;
    font-size: 0.9rem;
  }
  .HowTo_list li {
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: 16px;
    padding: 12px 16px;
  }
  .HowTo_list strong {
    display: block;
    font-weight: 900;
  }
  .Empty {
    background: var(--c-surface);
    border: 2px dashed var(--c-border);
    border-radius: var(--radius);
    padding: 32px;
    text-align: center;
    color: var(--c-text-sub);
  }
`

/** ヒーローに表示する注目トピックの雑談プレビュー */
const HeroChat = ({ topic }: { topic: Topic }) => {
  const colors = colorsFor(topic.participants)
  const byId = new Map(topic.participants.map((p) => [p.id, p]))
  let i = 0
  const sides = new Map(
    topic.participants.map((p) => [
      p.id,
      p.persona === "moderator" ? "left" : i++ % 2 ? "left" : "right",
    ])
  )
  const messages = topic.discussion
    .filter((d): d is DiscussionMessage => "speaker" in d)
    .slice(0, 4)
  return (
    <Link className="HeroChat" href={`${topicPath(topic.id)}#discussion`}>
      <p className="HeroChat_head">
        <small>
          {topic.scene
            ? `${topic.scene.emoji ?? "💬"} ${topic.scene.place}にて`
            : "💬 いま話していること"}
        </small>
        {topic.title}
      </p>
      <ul className="HeroChat_body">
        {messages.map((m, j) => {
          const p = byId.get(m.speaker)!
          const color = colors.get(p.id)!
          return (
            <li
              key={j}
              className={`HeroChat_msg HeroChat_msg--${sides.get(p.id)}`}
              style={{ "--bubble-bg": color.bubble } as React.CSSProperties}
            >
              <Avatar participant={p} color={color} size={32} />
              <span className="HeroChat_bubble">
                <span className="HeroChat_name">{displayName(p)}</span>
                <span className="HeroChat_text">{m.text}</span>
              </span>
            </li>
          )
        })}
      </ul>
      <p className="HeroChat_more">続きを読む →</p>
    </Link>
  )
}

const HomePage = () => {
  const all = getVisibleTopics()
  const featuredTopics = getFeaturedTopics()
  const featured = (featuredTopics.length > 0 ? featuredTopics : all)
    .slice(0, 3)
    .map(toCardData)
  const latest = all.slice(0, 6).map(toCardData)
  const heroTopic = (featuredTopics[0] ?? all[0]) as Topic | undefined

  return (
    <>
      <Style id="HomePage">{styles}</Style>
      <section className="Hero" aria-labelledby="hero-title">
        <Container>
          <div className="Hero_grid">
            <div className="Hero_inner">
              <p className="Hero_concept">🍻 {site.concept}</p>
              <h1 className="Hero_title" id="hero-title">
                <span className="Hero_line">社会のあれこれ、</span>
                <br />
                <span className="Hero_line">
                  <em>ちょっと</em>考えてみよう。
                </span>
              </h1>
              <p className="Hero_lead">
                普段はあまり考えない政治や社会の疑問を、いろんな視点から。
                <br />
                居酒屋やカフェでの友だちどうしの雑談をのぞく感覚で、気軽に読んでみてください。
              </p>
              <div className="Hero_actions">
                {featured[0] && (
                  <Link
                    className="Button Button--primary"
                    href={`/topics/${featured[0].id}/`}
                  >
                    今日の雑談をのぞく →
                  </Link>
                )}
                <Link className="Button Button--ghost" href="/about/">
                  RonToってなに？
                </Link>
              </div>
            </div>
            {heroTopic && <HeroChat topic={heroTopic} />}
          </div>
        </Container>
      </section>

      <Container>
        <Section labelledBy="featured">
          <SectionHeading id="featured" title="注目トピック" en="PICK UP" />
          {featured.length === 0 ? (
            <p className="Empty">
              記事を準備中です。公開まで少しお待ちください。
            </p>
          ) : (
            <ul className="Featured">
              {featured.map((t, i) => (
                <li key={t.id}>
                  <TopicCard topic={t} size={i === 0 ? "large" : "default"} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section labelledBy="latest">
          <SectionHeading
            id="latest"
            title="新着の雑談"
            en="LATEST"
            more={{ href: "/topics/", label: "ぜんぶ見る" }}
          />
          {latest.length === 0 ? (
            <p className="Empty">記事を準備中です。</p>
          ) : (
            <TopicGrid topics={latest} />
          )}
        </Section>

        <Section labelledBy="categories">
          <SectionHeading
            id="categories"
            title="カテゴリから探す"
            en="CATEGORIES"
          />
          <ul className="Categories">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  className="Categories_link"
                  href={`/categories/${c.id}/`}
                  style={{ "--cat-color": c.color } as React.CSSProperties}
                >
                  <span className="Categories_name">{c.name}</span>
                  <p className="Categories_desc">{c.description}</p>
                  <span className="Categories_count">
                    {getTopicsByCategory(c.id).length}件
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section labelledBy="types">
          <SectionHeading id="types" title="気になる切り口から" en="FORMATS" />
          <ul className="Types">
            {articleTypes.map((t) => (
              <li key={t.id}>
                <Link
                  className="Types_link"
                  href={
                    t.id === "election"
                      ? "/elections/"
                      : `/topics/?type=${t.id}`
                  }
                >
                  <span className="Types_emoji" aria-hidden="true">
                    {typeEmoji[t.id]}
                  </span>
                  <span>
                    <span className="Types_label">{t.label}</span>
                    <span className="Types_desc">{t.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section labelledBy="howto">
          <div className="HowTo">
            <h2 className="HowTo_title" id="howto">
              RonToは、
              <br />
              答えを決めない雑談です。
            </h2>
            <ul className="HowTo_list">
              <li>
                <strong>🍺 1つの記事で、1つの疑問。</strong>
                ニュースで気になったけど人には聞きにくい「そもそも」を、友だちどうしの雑談で話します。
              </li>
              <li>
                <strong>🤖 話しているのはAIのキャラクター。</strong>
                家計・経済・福祉・行政・地方など、それぞれの視点をもつ架空の人物です。実在の人の発言ではありません。
              </li>
              <li>
                <strong>📎 事実と意見はちゃんと分けます。</strong>
                統計や制度には出典と基準日を付けています。詳しくは
                <Link href="/about/#editorial-policy">編集方針</Link>へ。
              </li>
            </ul>
          </div>
        </Section>
      </Container>
    </>
  )
}

export default HomePage
