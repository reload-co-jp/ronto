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
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    line-height: 1;
    padding: 6px 9px;
    border-radius: 999px;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  .Badge--category {
    color: var(--badge-color);
    background: color-mix(in srgb, var(--badge-color) 11%, #fff);
  }
  .Badge--category::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--badge-color);
  }
  .Badge--type {
    color: var(--c-navy);
    background: var(--c-navy-soft);
  }
  .Badge--draft {
    color: #8a4b00;
    background: #fff1c2;
    border: 1px dashed #d9a400;
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
