import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TopicGrid } from "@/components/topic/TopicCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import {
  categories,
  categoryPath,
  getCategory,
  getTopicsByCategory,
  toCardData,
} from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

export const dynamicParams = false
export const generateStaticParams = () => categories.map((c) => ({ id: c.id }))

type Props = { params: Promise<{ id: string }> }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const c = getCategory((await params).id)
  if (!c) return {}
  return pageMetadata({
    title: `${c.name}の記事一覧`,
    description: `${c.name}に関するRonToの記事一覧。${c.description}`,
    path: categoryPath(c.id),
  })
}

const CategoryPage = async ({ params }: Props) => {
  const category = getCategory((await params).id)
  if (!category) notFound()
  const topics = getTopicsByCategory(category.id).map(toCardData)
  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "カテゴリ", href: "/categories/" },
          { name: category.name, href: categoryPath(category.id) },
        ]}
      />
      <PageHeader
        eyebrow="CATEGORY"
        title={category.name}
        lead={category.description}
      />
      <div style={{ paddingBottom: 64 }}>
        {topics.length > 0 ? (
          <TopicGrid topics={topics} />
        ) : (
          <p
            style={{
              background: "var(--c-surface)",
              borderRadius: "var(--radius)",
              padding: 32,
              color: "var(--c-text-sub)",
            }}
          >
            このカテゴリの記事は準備中です。
            <Link href="/topics/">ほかのトピック</Link>もご覧ください。
          </p>
        )}
      </div>
    </Container>
  )
}

export default CategoryPage
