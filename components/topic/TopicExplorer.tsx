"use client"

import { useEffect, useMemo, useState } from "react"
import { css, Style } from "@/components/ui/Style"
import { ArticleType, Category, TopicCardData } from "@/lib/types"
import { TopicGrid } from "./TopicCard"

const PAGE_SIZE = 12

const styles = css`
  .Explorer_filters {
    display: grid;
    gap: 14px;
    margin-bottom: 28px;
  }
  .Explorer_group {
    border: 0;
    padding: 0;
    min-width: 0;
  }
  .Explorer_legend {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--c-text-sub);
    letter-spacing: 0.08em;
    margin-bottom: 6px;
    padding: 0;
  }
  .Explorer_chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
  }
  .Explorer_chip {
    border: 2px solid var(--c-ink);
    background: var(--c-surface);
    color: var(--c-text);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .Explorer_chip:hover {
    border-color: var(--c-navy);
  }
  .Explorer_chip[aria-pressed="true"] {
    background: var(--c-yellow);
    color: var(--c-ink);
    font-weight: 900;
  }
  .Explorer_count {
    font-size: 0.85rem;
    color: var(--c-text-sub);
    margin-bottom: 16px;
  }
  .Explorer_empty {
    padding: 48px 16px;
    text-align: center;
    color: var(--c-text-sub);
    background: var(--c-surface);
    border-radius: var(--radius);
  }
  .Explorer_more {
    display: block;
    margin: 32px auto 0;
    background: var(--c-surface);
    border: 2px solid var(--c-ink);
    color: var(--c-ink);
    box-shadow: 3px 3px 0 var(--c-ink);
    border-radius: 999px;
    padding: 10px 32px;
    font-weight: 700;
    cursor: pointer;
  }
  .Explorer_more:hover {
    background: var(--c-navy);
    color: #fff;
  }
`

/**
 * 記事一覧の絞り込み（カテゴリ・記事形式）と段階的表示。
 * 静的書き出しのためクライアント側で絞り込み、状態は ?category=&type= に反映する。
 */
export const TopicExplorer = ({
  topics,
  categories,
  types,
}: {
  topics: TopicCardData[]
  categories: Category[]
  types: ArticleType[]
}) => {
  const [category, setCategory] = useState<string | null>(null)
  const [type, setType] = useState<string | null>(null)
  const [limit, setLimit] = useState(PAGE_SIZE)

  // URL のクエリから初期状態を復元（静的 HTML はフィルタなしで描画される）
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const c = q.get("category")
    const t = q.get("type")
    /* eslint-disable react-hooks/set-state-in-effect -- マウント後に一度だけ URL と同期する */
    if (c && categories.some((x) => x.id === c)) setCategory(c)
    if (t && types.some((x) => x.id === t)) setType(t)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [categories, types])

  useEffect(() => {
    const q = new URLSearchParams()
    if (category) q.set("category", category)
    if (type) q.set("type", type)
    const qs = q.toString()
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}`
    )
  }, [category, type])

  const filtered = useMemo(
    () =>
      topics.filter(
        (t) =>
          (!category || t.category.id === category) &&
          (!type || t.type.id === type)
      ),
    [topics, category, type]
  )

  const select =
    (setter: (v: string | null) => void) => (value: string | null) => {
      setter(value)
      setLimit(PAGE_SIZE)
    }

  return (
    <div>
      <Style id="Explorer">{styles}</Style>
      <div className="Explorer_filters">
        <FilterGroup
          legend="カテゴリ"
          options={categories.map((c) => ({ id: c.id, label: c.name }))}
          value={category}
          onChange={select(setCategory)}
        />
        <FilterGroup
          legend="記事の形式"
          options={types.map((t) => ({ id: t.id, label: t.label }))}
          value={type}
          onChange={select(setType)}
        />
      </div>
      <p className="Explorer_count" aria-live="polite">
        {filtered.length}件の記事
      </p>
      {filtered.length === 0 ? (
        <p className="Explorer_empty">
          条件に合う記事はまだありません。ほかの条件もお試しください。
        </p>
      ) : (
        <TopicGrid topics={filtered.slice(0, limit)} />
      )}
      {filtered.length > limit && (
        <button
          type="button"
          className="Explorer_more"
          onClick={() => setLimit((l) => l + PAGE_SIZE)}
        >
          もっと見る（残り{filtered.length - limit}件）
        </button>
      )}
    </div>
  )
}

const FilterGroup = ({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: { id: string; label: string }[]
  value: string | null
  onChange: (v: string | null) => void
}) => (
  <fieldset className="Explorer_group">
    <legend className="Explorer_legend">{legend}</legend>
    <div className="Explorer_chips">
      {[{ id: null, label: "すべて" }, ...options].map((o) => (
        <button
          key={o.id ?? "all"}
          type="button"
          className="Explorer_chip"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  </fieldset>
)
