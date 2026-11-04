import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ReactNode } from "react"
import {
  CategoryBadge,
  StatusBadge,
  TypeBadge,
} from "@/components/topic/Badges"
import { Blocks } from "@/components/topic/Blocks"
import { Discussion } from "@/components/topic/Discussion"
import { Participants } from "@/components/topic/Participants"
import { SourceList } from "@/components/topic/SourceList"
import {
  Impacts,
  Learned,
  Points,
  ProsCons,
  Questions,
} from "@/components/topic/Summary"
import { Thumbnail } from "@/components/topic/Thumbnail"
import { TopicGrid } from "@/components/topic/TopicCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, JsonLd } from "@/components/ui/primitives"
import { css, mq, Style } from "@/components/ui/Style"
import {
  categoryPath,
  getArticleType,
  getCategory,
  getRelatedTopics,
  getTopic,
  getVisibleTopics,
  readingTimeOf,
  resolveImage,
  toCardData,
  topicPath,
} from "@/lib/content"
import { formatDate } from "@/lib/format"
import { pageMetadata } from "@/lib/seo"
import { absoluteUrl, site } from "@/lib/site"
import { Topic } from "@/lib/types"

/** 記事データから生成されたページ以外は 404 */
export const dynamicParams = false

export const generateStaticParams = () =>
  getVisibleTopics().map((t) => ({ id: t.id }))

type Props = { params: Promise<{ id: string }> }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const topic = getTopic((await params).id)
  if (!topic) return {}
  return pageMetadata({
    title: topic.title,
    description: topic.description,
    path: topicPath(topic.id),
    image: resolveImage(topic.thumbnail),
    type: "article",
    publishedTime: topic.publishedAt,
    modifiedTime: topic.updatedAt ?? topic.publishedAt,
    noindex: topic.status !== "published",
  })
}

const styles = css`
  .Article {
    padding-bottom: 64px;
  }
  .Article_header {
    padding: 24px 0 8px;
    display: grid;
    gap: 14px;
  }
  .Article_title {
    font-size: 1.7rem;
    line-height: 1.45;
    letter-spacing: 0.03em;
    font-weight: 800;
  }
  ${mq.tablet} {
    .Article_title {
      font-size: 2.3rem;
    }
  }
  .Article_lead {
    font-size: 1.02rem;
    line-height: 1.95;
    color: #374055;
  }
  .Article_meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    font-size: 0.8rem;
    color: var(--c-text-sub);
  }
  .Article_meta strong {
    color: var(--c-accent);
    font-weight: 700;
  }
  .Article_thumb {
    margin: 20px 0 8px;
  }
  .Toc {
    margin: 28px 0 8px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius);
    padding: 16px 20px;
  }
  .Toc_title {
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--c-text-sub);
  }
  .Toc_list {
    margin-top: 8px;
    padding-left: 1.5em;
    display: grid;
    gap: 4px;
    font-size: 0.9rem;
  }
  .Toc_list a {
    text-decoration: none;
  }
  .Toc_list a:hover {
    color: var(--c-accent);
    text-decoration: underline;
  }
  .Article_section {
    padding-top: 44px;
    scroll-margin-top: 72px;
  }
  .Article_h2 {
    font-size: 1.35rem;
    line-height: 1.5;
    margin-bottom: 18px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    align-items: baseline;
  }
  .Article_num {
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--c-accent);
    letter-spacing: 0.08em;
    font-family: ui-monospace, monospace;
  }
  .Article_section--discussion {
    background: var(--c-surface-alt);
    margin: 44px calc(var(--gutter) * -1) 0;
    padding: 28px var(--gutter) 32px;
    border-radius: 0;
  }
  ${mq.tablet} {
    .Article_section--discussion {
      margin: 44px -32px 0;
      padding: 36px 32px;
      border-radius: var(--radius);
    }
  }
  .Primer {
    margin-top: 24px;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius);
  }
  .Primer_summary,
  .Cast_summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 700;
  }
  .Primer_summary::-webkit-details-marker,
  .Cast_summary::-webkit-details-marker {
    display: none;
  }
  .Primer_summary::after,
  .Cast_summary::after {
    content: "＋";
    color: var(--c-accent);
    font-weight: 800;
  }
  .Primer[open] .Primer_summary::after,
  .Cast[open] .Cast_summary::after {
    content: "−";
  }
  .Primer_summary {
    padding: 16px 20px;
  }
  .Primer_hint {
    display: block;
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--c-text-sub);
  }
  .Primer_body {
    padding: 0 20px 24px;
    display: grid;
    gap: 28px;
  }
  .Primer_h3 {
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 4px solid var(--c-accent);
    line-height: 1.5;
  }
  .Cast {
    margin-bottom: 16px;
  }
  .Cast_summary {
    padding: 10px 4px;
    font-size: 0.9rem;
    color: var(--c-navy);
  }
  .Cast_body {
    padding: 4px 0 12px;
  }
  .Article_cta {
    display: inline-flex;
    align-self: flex-start;
    align-items: center;
    gap: 8px;
    background: var(--c-accent);
    color: #fff;
    font-weight: 700;
    font-size: 0.9rem;
    text-decoration: none;
    border-radius: 999px;
    padding: 10px 20px;
  }
  .Article_cta:hover {
    background: #c95520;
  }
  .Toc {
    cursor: default;
  }
  .Toc summary {
    cursor: pointer;
  }
  .Article_note {
    font-size: 0.8rem;
    color: var(--c-text-sub);
    margin-top: 16px;
    line-height: 1.7;
  }
`

interface Part {
  id: string
  heading: string
  node: ReactNode
  className?: string
}

/** 記事の構成。中身が空の項目は表示しない */
const buildParts = (topic: Topic): Part[] => {
  const s = topic.summary
  const related = getRelatedTopics(topic).map(toCardData)
  const parts: (Part | false)[] = [
    topic.discussion.length > 0 && {
      id: "discussion",
      heading: "みんなで話してみた",
      className: "Article_section--discussion",
      node: (
        <>
          {topic.participants.length > 0 && (
            <details className="Cast">
              <summary className="Cast_summary">
                今回の登場人物（{topic.participants.length}人）
              </summary>
              <div className="Cast_body">
                <Participants participants={topic.participants} />
              </div>
            </details>
          )}
          <Discussion
            items={topic.discussion}
            participants={topic.participants}
            sources={topic.sources}
            title={topic.title}
          />
        </>
      ),
    },
    s.points.length > 0 && {
      id: "points",
      heading: "議論のポイント整理",
      node: <Points points={s.points} />,
    },
    (s.argumentsFor.length > 0 || s.argumentsAgainst.length > 0) && {
      id: "pros-cons",
      heading: "メリット・デメリット",
      node: (
        <>
          <ProsCons summary={s} />
          <p className="Article_note">
            ※賛否を同じ分量にそろえることはせず、根拠の強さや実際の論点に応じて整理しています。
          </p>
        </>
      ),
    },
    s.affectedParties.length > 0 && {
      id: "impacts",
      heading: "誰にどのような影響があるか",
      node: <Impacts parties={s.affectedParties} />,
    },
    (topic.takeaways.length > 0 ||
      s.knownFacts.length > 0 ||
      s.openQuestions.length > 0) && {
      id: "learned",
      heading: "今回の議論で分かったこと",
      node: (
        <Learned
          takeaways={topic.takeaways}
          summary={s}
          sources={topic.sources}
        />
      ),
    },
    topic.furtherQuestions.length > 0 && {
      id: "further",
      heading: "さらに考えたいこと",
      node: <Questions questions={topic.furtherQuestions} />,
    },
    topic.sources.length > 0 && {
      id: "sources",
      heading: "参考情報・出典",
      node: (
        <>
          <SourceList sources={topic.sources} />
          <p className="Article_note">
            ※統計・制度の内容は記事内に記載した基準日時点のものです。最新の情報は各出典元でご確認ください。AIによる議論部分は、出典の事実をもとにした考察であり、特定の政党・政治家の主張ではありません。
          </p>
        </>
      ),
    },
    related.length > 0 && {
      id: "related",
      heading: "関連記事",
      node: <TopicGrid topics={related} columns={3} />,
    },
  ]
  return parts.filter((p): p is Part => Boolean(p))
}

const TopicPage = async ({ params }: Props) => {
  const topic = getTopic((await params).id)
  if (!topic) notFound()

  const category = getCategory(topic.category)!
  const type = getArticleType(topic.type)
  const thumbnail = resolveImage(topic.thumbnail)
  const parts = buildParts(topic)
  const wasUpdated = topic.updatedAt && topic.updatedAt !== topic.publishedAt
  const url = absoluteUrl(topicPath(topic.id))

  return (
    <Container narrow>
      <Style id="TopicPage">{styles}</Style>
      <Breadcrumbs
        items={[
          { name: "トピック一覧", href: "/topics/" },
          { name: category.name, href: categoryPath(category.id) },
          { name: topic.title, href: topicPath(topic.id) },
        ]}
      />
      <article className="Article">
        <header className="Article_header">
          <div className="Badges">
            <CategoryBadge category={category} />
            <TypeBadge type={type} />
            <StatusBadge status={topic.status} />
          </div>
          <h1 className="Article_title">{topic.title}</h1>
          {topic.lead && <p className="Article_lead">{topic.lead}</p>}
          <p className="Article_meta">
            {topic.publishedAt && (
              <span>
                公開日{" "}
                <time dateTime={topic.publishedAt}>
                  {formatDate(topic.publishedAt)}
                </time>
              </span>
            )}
            {wasUpdated && (
              <span>
                <strong>更新日</strong>{" "}
                <time dateTime={topic.updatedAt}>
                  {formatDate(topic.updatedAt)}
                </time>
              </span>
            )}
            <span>読了目安 {readingTimeOf(topic)}分</span>
          </p>
          {topic.discussion.length > 0 && (
            <a className="Article_cta" href="#discussion">
              💬 AIたちの議論を読む ↓
            </a>
          )}
        </header>
        {thumbnail && (
          <div className="Article_thumb">
            <Thumbnail
              src={thumbnail}
              alt=""
              category={category}
              type={type}
              priority
            />
          </div>
        )}

        {topic.sections.length > 0 && (
          <details className="Primer">
            <summary className="Primer_summary">
              <span>
                議論の前に：3分で予備知識
                <span className="Primer_hint">
                  {topic.sections.map((sec) => sec.heading).join("／")}
                </span>
              </span>
            </summary>
            <div className="Primer_body">
              {topic.sections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  aria-labelledby={`${sec.id}-heading`}
                >
                  <h2 className="Primer_h3" id={`${sec.id}-heading`}>
                    {sec.heading}
                  </h2>
                  <Blocks blocks={sec.blocks} sources={topic.sources} />
                </section>
              ))}
            </div>
          </details>
        )}

        <details className="Toc">
          <summary className="Toc_title">この記事の内容</summary>
          <ol className="Toc_list">
            {parts.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>{p.heading}</a>
              </li>
            ))}
          </ol>
        </details>

        {parts.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className={`Article_section ${p.className ?? ""}`}
            aria-labelledby={`${p.id}-heading`}
          >
            <h2 className="Article_h2" id={`${p.id}-heading`}>
              <span className="Article_num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{p.heading}</span>
            </h2>
            {p.node}
          </section>
        ))}
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: topic.title,
          description: topic.description,
          image: [absoluteUrl(thumbnail ?? site.ogImage)],
          datePublished: topic.publishedAt,
          dateModified: topic.updatedAt ?? topic.publishedAt,
          inLanguage: "ja",
          articleSection: category.name,
          keywords: topic.tags.join(","),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          author: {
            "@type": "Organization",
            name: `${site.name}編集部`,
            url: site.url,
          },
          publisher: {
            "@type": "Organization",
            name: site.publisher.name,
            url: site.publisher.url,
          },
          citation: topic.sources.map((s) => ({
            "@type": "CreativeWork",
            name: s.title,
            url: s.url,
            publisher: s.publisher,
          })),
        }}
      />
    </Container>
  )
}

export default TopicPage
