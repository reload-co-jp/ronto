import Link from "next/link"
import { TopicGrid } from "@/components/topic/TopicCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import {
  Container,
  PageHeader,
  Section,
  SectionHeading,
} from "@/components/ui/primitives"
import { Prose } from "@/components/ui/Prose"
import { css, mq, Style } from "@/components/ui/Style"
import electionsJson from "@/content/elections.json"
import { getVisibleTopics, toCardData } from "@/lib/content"
import { formatDate } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"

/**
 * 選挙特集のデータ構造（content/elections.json）。
 * 選挙ごとに争点と、各政党・候補者の公約（一次情報の URL 付き）を並べて比較できる。
 */
interface ElectionFeature {
  id: string
  title: string
  electionDate: string
  description: string
  issues: {
    id: string
    title: string
    topicIds?: string[]
    positions: { name: string; summary: string; sourceUrl: string }[]
  }[]
}

const features = (electionsJson as { features: ElectionFeature[] }).features

const description =
  "選挙の前に知っておきたい争点を、立場の違いが分かるように整理する特集ページです。"

export const metadata = pageMetadata({
  title: "選挙・特集",
  description,
  path: "/elections/",
})

const styles = css`
  .Issue {
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 20px;
    border: 2px solid var(--c-ink);
  }
  .Issue + .Issue {
    margin-top: 16px;
  }
  .Issue_title {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }
  .Issue_positions {
    display: grid;
    gap: 10px;
    list-style: none;
  }
  ${mq.tablet} {
    .Issue_positions {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .Issue_position {
    background: var(--c-bg);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    font-size: 0.9rem;
  }
  .Issue_name {
    font-weight: 700;
    display: block;
  }
  .Issue_src {
    font-size: 0.75rem;
  }
`

const ElectionsPage = () => {
  const electionTopics = getVisibleTopics()
    .filter((t) => t.type === "election")
    .map(toCardData)
  return (
    <Container>
      <Style id="ElectionsPage">{styles}</Style>
      <Breadcrumbs items={[{ name: "選挙・特集", href: "/elections/" }]} />
      <PageHeader eyebrow="ELECTION" title="選挙の前に" lead={description} />

      {features.map((f) => (
        <Section key={f.id} labelledBy={`feature-${f.id}`}>
          <SectionHeading id={`feature-${f.id}`} title={f.title} />
          <p style={{ marginBottom: 20 }}>
            投票日：{formatDate(f.electionDate)} ／ {f.description}
          </p>
          {f.issues.map((issue) => (
            <div className="Issue" key={issue.id}>
              <h3 className="Issue_title">{issue.title}</h3>
              <ul className="Issue_positions">
                {issue.positions.map((p) => (
                  <li className="Issue_position" key={p.name}>
                    <span className="Issue_name">{p.name}</span>
                    {p.summary}{" "}
                    <a
                      className="Issue_src"
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      出典
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      ))}

      <Section labelledBy="election-topics">
        <SectionHeading id="election-topics" title="「選挙の前に」の記事" />
        {electionTopics.length > 0 ? (
          <TopicGrid topics={electionTopics} />
        ) : (
          <Prose>
            <p className="Prose_box">
              選挙に関する記事は現在準備中です。公開まで、
              <Link href="/categories/politics/">政治・行政</Link>
              カテゴリの記事もご覧ください。
            </p>
          </Prose>
        )}
      </Section>

      <Section labelledBy="election-policy">
        <SectionHeading id="election-policy" title="選挙特集の方針" />
        <Prose>
          <ul>
            <li>
              政党・候補者の主張は、公式サイトや選挙公報などの一次情報から引用し、出典を明記します。
            </li>
            <li>
              AIによる議論・分析と、実際の政党・候補者の主張ははっきり分けて掲載します。
            </li>
            <li>特定の政党・候補者への投票を呼びかけることはありません。</li>
            <li>
              掲載順は五十音順など機械的な基準とし、評価や順位付けを意味しません。
            </li>
          </ul>
        </Prose>
      </Section>
    </Container>
  )
}

export default ElectionsPage
