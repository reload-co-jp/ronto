import { css, Style } from "@/components/ui/Style"
import { ArticleType, Category } from "@/lib/types"

const styles = css`
  .Thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--c-surface-alt);
    border: 2px solid var(--c-ink);
    container-type: inline-size;
  }
  .Thumbnail_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .Thumbnail_fallback {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--thumb-color) 26%, #fff7ea);
  }
  .Thumbnail_fallback svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .Thumbnail_label {
    position: absolute;
    left: 6%;
    bottom: 11%;
    font-weight: 900;
    color: var(--c-ink);
    font-size: clamp(1.1rem, 6cqw, 2.6rem);
    line-height: 1.1;
    letter-spacing: 0.04em;
  }
  .Thumbnail_code {
    display: block;
    width: fit-content;
    font-size: 0.4em;
    letter-spacing: 0.2em;
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    padding: 0.15em 0.7em;
    margin-bottom: 0.4em;
  }
`

/**
 * アイキャッチ画像。画像が存在しない場合はカテゴリ色と記事形式から作る図形のフォールバックを表示する。
 * src はサーバー側で存在確認済みのパス（lib/content.ts resolveImage）を渡す。
 */
export const Thumbnail = ({
  src,
  alt,
  category,
  type,
  priority,
}: {
  src: string | null
  alt: string
  category: Category
  type: ArticleType
  priority?: boolean
}) => (
  <div
    className="Thumbnail"
    style={{ "--thumb-color": category.color } as React.CSSProperties}
  >
    <Style id="Thumbnail">{styles}</Style>
    {src ? (
      // 静的書き出しのため next/image の最適化は使わない
      <img
        className="Thumbnail_img"
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    ) : (
      <div className="Thumbnail_fallback" aria-hidden="true">
        <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
          <circle cx="262" cy="40" r="58" fill="#fff" opacity="0.55" />
          <circle cx="40" cy="30" r="6" fill={category.color} />
          <circle
            cx="300"
            cy="160"
            r="9"
            fill="#ffc94a"
            stroke="#2b2a33"
            strokeWidth="2"
          />
          <g stroke="#2b2a33" strokeWidth="2.5">
            <rect x="166" y="54" width="96" height="50" rx="22" fill="#fff" />
            <path
              d="M184 103 l-6 16 l20 -16z"
              fill="#fff"
              strokeLinejoin="round"
            />
            <rect
              x="214"
              y="96"
              width="88"
              height="46"
              rx="22"
              fill={category.color}
            />
            <path
              d="M282 141 l8 15 l-22 -15z"
              fill={category.color}
              strokeLinejoin="round"
            />
          </g>
          <circle cx="196" cy="79" r="5" fill="#2b2a33" />
          <circle cx="214" cy="79" r="5" fill="#2b2a33" />
          <circle cx="232" cy="79" r="5" fill="#2b2a33" />
          <path
            d="M240 120 q18 12 36 0"
            stroke="#fff"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <span className="Thumbnail_label">
          <span className="Thumbnail_code">{type.code}</span>
          {type.label}
        </span>
      </div>
    )}
  </div>
)
