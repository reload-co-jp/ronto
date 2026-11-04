import { css, Style } from "@/components/ui/Style"
import { ArticleType, Category, TopicStatus } from "@/lib/types"

const styles = css`
  .Badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  .Badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    padding: 5px 10px;
    border-radius: 999px;
    letter-spacing: 0.03em;
    white-space: nowrap;
    border: 1.5px solid var(--c-ink);
  }
  .Badge--category {
    color: var(--c-ink);
    background: color-mix(in srgb, var(--badge-color) 22%, #fff);
  }
  .Badge--category::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--badge-color);
  }
  .Badge--type {
    color: var(--c-ink);
    background: var(--c-yellow-soft);
  }
  .Badge--draft {
    color: #8a4b00;
    background: #fff1c2;
    border-style: dashed;
  }
`

export const BadgeStyles = () => <Style id="Badges">{styles}</Style>

export const CategoryBadge = ({ category }: { category: Category }) => (
  <span
    className="Badge Badge--category"
    style={{ "--badge-color": category.color } as React.CSSProperties}
  >
    <BadgeStyles />
    {category.name}
  </span>
)

export const TypeBadge = ({ type }: { type: ArticleType }) => (
  <span className="Badge Badge--type">
    <BadgeStyles />
    {type.label}
  </span>
)

export const StatusBadge = ({ status }: { status: TopicStatus }) =>
  status === "published" ? null : (
    <span className="Badge Badge--draft">
      <BadgeStyles />
      {status === "draft" ? "下書き（本番非表示）" : "アーカイブ"}
    </span>
  )
