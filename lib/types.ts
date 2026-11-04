/**
 * RonTo のコンテンツ型定義。
 * content/ 配下の JSON はすべてこの型に沿って記述する（lib/validate.ts で検証）。
 */

export const TOPIC_STATUSES = ["draft", "published", "archived"] as const
export type TopicStatus = (typeof TOPIC_STATUSES)[number]

export const ARTICLE_TYPE_IDS = [
  "why",
  "discussion",
  "benefit",
  "comparison",
  "election",
] as const
export type ArticleTypeId = (typeof ARTICLE_TYPE_IDS)[number]

export const ICON_NAMES = [
  "shopping-cart",
  "calculator",
  "heart",
  "building",
  "map",
  "compass",
  "user",
  "globe",
  "book",
  "scale",
] as const
export type IconName = (typeof ICON_NAMES)[number]

export interface Category {
  id: string
  name: string
  description: string
  /** カード等で使うアクセントカラー */
  color: string
}

export interface ArticleType {
  id: ArticleTypeId
  /** 大文字の種別コード（WHY など） */
  code: string
  label: string
  description: string
}

/** 標準的な議論の役割（content/personas.json） */
export interface Persona {
  id: string
  name: string
  description: string
  stance: string
  concerns: string[]
  icon: IconName
}

/** 記事ごとの登場人物。persona を指定すると標準役割の値を引き継ぎ、記事側の値で上書きする。 */
export interface Participant {
  id: string
  persona?: string
  name: string
  description: string
  stance: string
  concerns: string[]
  icon: IconName
}

export type Block =
  | { type: "paragraph"; text: string; sourceIds?: string[] }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; title?: string; text: string }
  | {
      type: "figures"
      items: {
        label: string
        value: string
        note?: string
        asOf?: string
        sourceIds?: string[]
      }[]
    }

export interface Section {
  /** background（基本情報・背景）/ problem（そもそも何が問題なのか）など */
  id: string
  heading: string
  blocks: Block[]
}

export type DiscussionItem =
  { speaker: string; text: string; sourceIds?: string[] } | { divider: string }

export interface Fact {
  text: string
  asOf?: string
  sourceIds?: string[]
}

export interface Summary {
  /** 主な論点（議論のポイント整理） */
  points: string[]
  /** 賛成・推進側の主な根拠（メリット） */
  argumentsFor: string[]
  /** 慎重・反対側の主な根拠（デメリット） */
  argumentsAgainst: string[]
  /** 影響を受ける人・組織 */
  affectedParties: { who: string; impact: string }[]
  /** 現時点で分かっている事実 */
  knownFacts: Fact[]
  /** まだ結論が出ていない点 */
  openQuestions: string[]
}

export interface Source {
  id: string
  title: string
  url: string
  publisher: string
  publishedAt?: string
  accessedAt: string
}

/** 記事の作成・確認に関する情報（将来の AI 生成・ファクトチェック自動化用） */
export interface Editorial {
  aiGenerated: boolean
  models?: string[]
  factCheckedAt?: string
  notes?: string
}

export interface Topic {
  id: string
  title: string
  description: string
  lead?: string
  category: string
  type: ArticleTypeId
  publishedAt?: string
  updatedAt?: string
  status: TopicStatus
  featured: boolean
  /** 分。省略時は本文量から算出 */
  readingTime?: number
  thumbnail?: string
  tags: string[]
  participants: Participant[]
  sections: Section[]
  discussion: DiscussionItem[]
  summary: Summary
  takeaways: string[]
  furtherQuestions: string[]
  sources: Source[]
  related: string[]
  editorial?: Editorial
}

/** 一覧表示用の軽量データ（クライアントコンポーネントへ渡す） */
export interface TopicCardData {
  id: string
  title: string
  description: string
  category: Category
  type: ArticleType
  publishedAt?: string
  updatedAt?: string
  readingTime: number
  /** 存在が確認できた画像パス。なければ null（フォールバック表示） */
  thumbnail: string | null
  status: TopicStatus
}
