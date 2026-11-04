import Link from "next/link"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import { css, mq, Style } from "@/components/ui/Style"
import { categories, getTopicsByCategory } from "@/lib/content"
import { pageMetadata } from "@/lib/seo"

const description =
  "経済・税金、政治・行政、地方・まちづくり、教育・子育て、社会保障・福祉、外交・安全保障。RonToのカテゴリ一覧です。"

export const metadata = pageMetadata({
  title: "カテゴリ",
  description,
  path: "/categories/",
})

const styles = css`
  .CatList {
    list-style: none;
    display: grid;
    gap: 14px;
    padding-bottom: 64px;
  }
  ${mq.tablet} {
    .CatList {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .CatList_link {
    display: grid;
    gap: 6px;
    text-decoration: none;
    background: var(--c-surface);
    border-radius: var(--radius);
    padding: 22px;
    border-left: 6px solid var(--cat-color);
    box-shadow: var(--shadow);
    border-top: 2px solid var(--c-ink);
    border-right: 2px solid var(--c-ink);
    border-bottom: 2px solid var(--c-ink);
    height: 100%;
  }
  .CatList_name {
    font-size: 1.2rem;
    font-weight: 800;
  }
  .CatList_link:hover .CatList_name {
    color: var(--cat-color);
  }
  .CatList_desc {
    font-size: 0.88rem;
    color: var(--c-text-sub);
  }
  .CatList_count {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--cat-color);
  }
`

const CategoriesPage = () => (
  <Container>
    <Style id="CategoriesPage">{styles}</Style>
    <Breadcrumbs items={[{ name: "カテゴリ", href: "/categories/" }]} />
    <PageHeader eyebrow="CATEGORIES" title="カテゴリ" lead={description} />
    <ul className="CatList">
      {categories.map((c) => (
        <li key={c.id}>
          <Link
            className="CatList_link"
            href={`/categories/${c.id}/`}
            style={{ "--cat-color": c.color } as React.CSSProperties}
          >
            <span className="CatList_name">{c.name}</span>
            <span className="CatList_desc">{c.description}</span>
            <span className="CatList_count">
              {getTopicsByCategory(c.id).length}件の記事
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </Container>
)

export default CategoriesPage
