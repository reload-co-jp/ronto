import { TopicExplorer } from "@/components/topic/TopicExplorer"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import {
  articleTypes,
  categories,
  getVisibleTopics,
  toCardData,
} from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

const description =
  "RonToのトピック一覧。税金・選挙・社会保障・地方など、政治や社会の素朴な疑問を、カテゴリや記事の形式から探せます。"

export const metadata = pageMetadata({
  title: "トピック一覧",
  description,
  path: "/topics/",
})

const TopicsPage = () => (
  <Container>
    <Breadcrumbs items={[{ name: "トピック一覧", href: "/topics/" }]} />
    <PageHeader eyebrow="TOPICS" title="トピック一覧" lead={description} />
    <div style={{ paddingBottom: 64 }}>
      <TopicExplorer
        topics={getVisibleTopics().map(toCardData)}
        categories={categories}
        types={articleTypes}
      />
    </div>
  </Container>
)

export default TopicsPage
