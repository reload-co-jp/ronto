import Link from "next/link"
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
} from "@/lib/content"
import { site } from "@/lib/site"

const styles = css`
  .Hero {
    position: relative;
    overflow: hidden;
    padding: 48px 0 40px;
    background: linear-gradient(180deg, #fff 0%, var(--c-bg) 100%);
    border-bottom: 1px solid var(--c-border);
  }
  .Hero_inner {
    position: relative;
    z-index: 1;
  }
  .Hero_concept {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--c-navy);
    background: var(--c-navy-soft);
    border-radius: 999px;
    padding: 4px 12px;
    letter-spacing: 0.06em;
  }
  .Hero_title {
    font-size: 2rem;
    line-height: 1.45;
    margin-top: 16px;
    letter-spacing: 0.04em;
    font-weight: 800;
  }
  .Hero_title em {
    font-style: normal;
    color: var(--c-accent);
  }
  .Hero_lead {
    margin-top: 14px;
    color: var(--c-text-sub);
    max-width: 32em;
  }
  .Hero_actions {
    margin-top: 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .Button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    padding: 12px 22px;
    font-weight: 700;
    text-decoration: none;
    font-size: 0.95rem;
  }
  .Button--primary {
    background: var(--c-accent);
    color: #fff;
  }
  .Button--primary:hover {
    background: #c95520;
  }
  .Button--ghost {
    border: 1px solid var(--c-navy);
    color: var(--c-navy);
  }
  .Button--ghost:hover {
    background: var(--c-navy);
    color: #fff;
  }
  .Hero_art {
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    width: 360px;
    opacity: 0.35;
    z-index: 0;
  }
  ${mq.tablet} {
    .Hero {
      padding: 80px 0 72px;
    }
    .Hero_title {
      font-size: 2.9rem;
    }
    .Hero_art {
      right: 4%;
      width: 420px;
      opacity: 1;
    }
  }
  .Featured {
    display: grid;
    gap: 24px;
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
    gap: 12px;
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
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 18px;
    border-top: 4px solid var(--cat-color);
    box-shadow: var(--shadow);
  }
  .Categories_link:hover .Categories_name {
    color: var(--cat-color);
  }
  .Categories_name {
    font-weight: 700;
    font-size: 1.05rem;
  }
  .Categories_desc {
    font-size: 0.8rem;
    color: var(--c-text-sub);
    margin-top: 4px;
    line-height: 1.6;
  }
  .Categories_count {
    font-size: 0.75rem;
    color: var(--cat-color);
    font-weight: 700;
    margin-top: 8px;
    display: block;
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
    border: 1px solid var(--c-border);
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 16px;
  }
  ${mq.tablet} {
    .Types_link {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .Types_link:hover {
    border-color: var(--c-accent);
  }
  .Types_code {
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    font-weight: 700;
    color: var(--c-accent);
  }
  .Types_label {
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--c-navy);
    display: block;
  }
  .Types_desc {
    font-size: 0.78rem;
    color: var(--c-text-sub);
    line-height: 1.6;
  }
  .HowTo {
    background: var(--c-navy);
    color: #fff;
    border-radius: var(--radius);
    padding: 28px 24px;
    display: grid;
    gap: 16px;
  }
  ${mq.tablet} {
    .HowTo {
      grid-template-columns: 1fr 2fr;
      padding: 40px;
      gap: 32px;
    }
  }
  .HowTo_title {
    font-size: 1.3rem;
    line-height: 1.5;
  }
  .HowTo_list {
    list-style: none;
    display: grid;
    gap: 12px;
    font-size: 0.9rem;
    color: #dfe4ee;
  }
  .HowTo_list strong {
    color: #fff;
    display: block;
  }
  .HowTo a {
    color: #fff;
  }
  .Empty {
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 32px;
    text-align: center;
    color: var(--c-text-sub);
  }
`

const HeroArt = () => (
  <svg className="Hero_art" viewBox="0 0 420 300" aria-hidden="true">
    <circle cx="300" cy="150" r="120" fill="#fdeee5" />
    <circle cx="150" cy="220" r="60" fill="#e8ecf4" />
    <rect x="70" y="70" width="190" height="96" rx="24" fill="#1f2d4d" />
    <path d="M110 166 l-14 30 l42 -30z" fill="#1f2d4d" />
    <rect
      x="98"
      y="100"
      width="120"
      height="10"
      rx="5"
      fill="#fff"
      opacity="0.9"
    />
    <rect
      x="98"
      y="124"
      width="80"
      height="10"
      rx="5"
      fill="#fff"
      opacity="0.5"
    />
    <rect x="200" y="150" width="170" height="86" rx="24" fill="#e2672e" />
    <path d="M330 236 l18 28 l-48 -28z" fill="#e2672e" />
    <circle cx="246" cy="193" r="7" fill="#fff" />
    <circle cx="285" cy="193" r="7" fill="#fff" />
    <circle cx="324" cy="193" r="7" fill="#fff" />
  </svg>
)

const HomePage = () => {
  const all = getVisibleTopics()
  const featuredTopics = getFeaturedTopics()
  const featured = (featuredTopics.length > 0 ? featuredTopics : all)
    .slice(0, 3)
    .map(toCardData)
  const latest = all.slice(0, 6).map(toCardData)

  return (
    <>
      <Style id="HomePage">{styles}</Style>
      <section className="Hero" aria-labelledby="hero-title">
        <Container>
          <div className="Hero_inner">
            <p className="Hero_concept">{site.concept}</p>
            <h1 className="Hero_title" id="hero-title">
              社会のあれこれ、
              <br />
              <em>ちょっと</em>考えてみよう。
            </h1>
            <p className="Hero_lead">
              普段はあまり考えない政治や社会の疑問を、いろんな視点から。
              <br />
              立場の違うAIたちの話し合いを読みながら、自分なりの考えを見つけてみてください。
            </p>
            <div className="Hero_actions">
              {featured[0] && (
                <Link
                  className="Button Button--primary"
                  href={`/topics/${featured[0].id}/`}
                >
                  注目のトピックを読む →
                </Link>
              )}
              <Link className="Button Button--ghost" href="/about/">
                RonToの読み方
              </Link>
            </div>
          </div>
        </Container>
        <HeroArt />
      </section>

      <Container>
        <Section labelledBy="featured">
          <SectionHeading id="featured" title="注目トピック" en="FEATURED" />
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
            title="新着記事"
            en="LATEST"
            more={{ href: "/topics/", label: "すべての記事" }}
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
                    {getTopicsByCategory(c.id).length}件の記事
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section labelledBy="types">
          <SectionHeading
            id="types"
            title="気になる切り口から読む"
            en="FORMATS"
          />
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
                  <span>
                    <span className="Types_code">{t.code}</span>
                    <span className="Types_label">{t.label}</span>
                  </span>
                  <span className="Types_desc">{t.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section labelledBy="howto">
          <div className="HowTo">
            <h2 className="HowTo_title" id="howto">
              RonToは、答えを決めない読み物です。
            </h2>
            <ul className="HowTo_list">
              <li>
                <strong>1つの記事で、1つの疑問。</strong>
                ニュースで気になったけれど聞きにくい「そもそも」から始めます。
              </li>
              <li>
                <strong>立場の違うAIたちが話し合います。</strong>
                生活者・経済・社会保障・行政・地方など、AIが演じる架空の役割です。実在の人物の発言ではありません。
              </li>
              <li>
                <strong>事実と意見を分けて整理します。</strong>
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
