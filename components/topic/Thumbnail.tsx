import { css, Style } from "@/components/ui/Style"
import { ArticleType, Category } from "@/lib/types"

const styles = css`
  .Thumbnail {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--c-surface-alt);
  }
  .Thumbnail_img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .Thumbnail_fallback {
    position: absolute;
    inset: 0;
    background: color-mix(in srgb, var(--thumb-color) 14%, #fbf9f5);
  }
  .Thumbnail_fallback svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .Thumbnail_label {
    position: absolute;
    left: 7%;
    bottom: 12%;
    font-weight: 800;
    color: var(--thumb-color);
    font-size: clamp(1.1rem, 5cqw, 2.4rem);
    line-height: 1.1;
    letter-spacing: 0.04em;
  }
  .Thumbnail_code {
    display: block;
    font-size: 0.45em;
    letter-spacing: 0.24em;
    opacity: 0.7;
    margin-bottom: 0.3em;
  }
  .Thumbnail {
    container-type: inline-size;
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
          <circle
            cx="250"
            cy="56"
            r="64"
            fill={category.color}
            opacity="0.16"
          />
          <circle
            cx="292"
            cy="150"
            r="38"
            fill={category.color}
            opacity="0.24"
          />
          <rect
            x="176"
            y="96"
            width="70"
            height="46"
            rx="12"
            fill="#fff"
            opacity="0.9"
          />
          <rect
            x="216"
            y="70"
            width="80"
            height="44"
            rx="12"
            fill={category.color}
            opacity="0.85"
          />
          <circle cx="236" cy="92" r="4" fill="#fff" />
          <circle cx="256" cy="92" r="4" fill="#fff" />
          <circle cx="276" cy="92" r="4" fill="#fff" />
          <rect
            x="190"
            y="112"
            width="40"
            height="5"
            rx="2.5"
            fill={category.color}
            opacity="0.5"
          />
          <rect
            x="190"
            y="124"
            width="26"
            height="5"
            rx="2.5"
            fill={category.color}
            opacity="0.35"
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
