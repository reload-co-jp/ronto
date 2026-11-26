import { TopicExplorer } from "@/components/topic/TopicExplorer"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, JsonLd, PageHeader } from "@/components/ui/primitives"
import {
  articleTypes,
  categories,
  getVisibleTopics,
  toCardData,
  topicPath,
} from "@/lib/content"
import { collectionJsonLd, pageMetadata } from "@/lib/seo"

const description =
  "RonToのトピック一覧。税金・選挙・社会保障・地方など、政治や社会の素朴な疑問を、カテゴリや記事の形式から探せます。"

export const metadata = pageMetadata({
  title: "トピック一覧",
  description,
  path: "/topics/",
})

const TopicsPage = () => {
  const topics = getVisibleTopics()
  return (
    <Container>
      <Breadcrumbs items={[{ name: "トピック一覧", href: "/topics/" }]} />
      <PageHeader eyebrow="TOPICS" title="トピック一覧" lead={description} />
      <div style={{ paddingBottom: 64 }}>
        <TopicExplorer
          topics={topics.map(toCardData)}
          categories={categories}
          types={articleTypes}
        />
      </div>
      {/* 一覧は「もっと見る」で段階表示するため、全記事は構造化データで示す */}
      <JsonLd
        data={collectionJsonLd({
          name: "トピック一覧",
          description,
          path: "/topics/",
          items: topics.map((t) => ({ name: t.title, path: topicPath(t.id) })),
        })}
      />
    </Container>
  )
}

export default TopicsPage
