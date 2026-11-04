import Link from "next/link"
import { absoluteUrl } from "@/lib/site"
import { JsonLd } from "./primitives"
import { css, Style } from "./Style"

export interface Crumb {
  name: string
  href: string
}

const styles = css`
  .Breadcrumbs {
    padding-top: 20px;
    font-size: 0.8rem;
    color: var(--c-text-sub);
  }
  .Breadcrumbs_list {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 4px 0;
  }
  .Breadcrumbs_item {
    display: flex;
    align-items: center;
  }
  .Breadcrumbs_item + .Breadcrumbs_item::before {
    content: "›";
    margin: 0 8px;
    color: var(--c-border);
  }
  .Breadcrumbs_link {
    text-decoration: none;
  }
  .Breadcrumbs_link:hover {
    text-decoration: underline;
    color: var(--c-text);
  }
  .Breadcrumbs_current {
    color: var(--c-text);
    max-width: 20em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

/** パンくずリスト + BreadcrumbList 構造化データ。items の先頭に「トップ」を自動で付ける */
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const all = [{ name: "トップ", href: "/" }, ...items]
  return (
    <nav className="Breadcrumbs" aria-label="パンくずリスト">
      <Style id="Breadcrumbs">{styles}</Style>
      <ol className="Breadcrumbs_list">
        {all.map((c, i) => (
          <li key={c.href} className="Breadcrumbs_item">
            {i === all.length - 1 ? (
              <span className="Breadcrumbs_current" aria-current="page">
                {c.name}
              </span>
            ) : (
              <Link className="Breadcrumbs_link" href={c.href}>
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.href),
          })),
        }}
      />
    </nav>
  )
}
