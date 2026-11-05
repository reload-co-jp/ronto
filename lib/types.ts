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
  /** 会話中に表示する呼び名（例：ユイ） */
  nickname?: string
  /** ひとことプロフィール（例：32歳・メーカー勤務） */
  profile?: string
  /** 役割名（例：生活者の視点） */
  name: string
  description: string
  stance: string
  concerns: string[]
  icon: IconName
}

/** キャラクターの表情（content/characters.json の expressionImages のキー） */
export const CHARACTER_EXPRESSIONS = [
  "normal",
  "happy",
  "surprised",
  "confused",
  "thinking",
  "serious",
] as const
export type CharacterExpression = (typeof CHARACTER_EXPRESSIONS)[number]

/** キャラクター同士の関係 */
export interface CharacterRelationship {
  characterId: string
  /** 関係をひとことで（例：頼れる解説役） */
  label: string
  description: string
}

/**
 * RonTo の公式キャラクター（content/characters.json）。
 * 職業はキャラクター設定であり、実在の専門家としての権威を示すものではない。
 */
export interface Character {
  id: string
  /** 会話中に表示する呼び名 */
  name: string
  species: string
  /** キャッチコピー */
  tagline: string
  /** 一言紹介 */
  description: string
  occupation: string
  /** チャットで名前の横に表示する短い肩書き */
  shortTitle: string
  occupationDetail: string
  /** 性格を表すキーワード */
  personality: string[]
  personalityDetail: string
  hobbies: string[]
  likes: string[]
  dislikes: string[]
  /** 得意な話題 */
  specialties: string[]
  /** 議論での役割 */
  role: string
  catchphrase: string
  /** moderator（聞き役・チャットの左側固定）/ panelist */
  chatRole: "moderator" | "panelist"
  /** キャラクターごとの配色 */
  color: { main: string; bg: string; bubble: string }
  /** 画像がないときに使う線画アイコン */
  fallbackIcon: IconName
  relationships: CharacterRelationship[]
  profileImage?: string
  icon?: string
  expressionImages: Partial<Record<CharacterExpression, string>>
}

/** 記事ごとの登場人物。persona / character を指定すると標準の値を引き継ぎ、記事側の値で上書きする。 */
export interface Participant {
  id: string
  persona?: string
  /** content/characters.json のキャラクター id */
  character?: string
  nickname?: string
  profile?: string
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

/** 発言の種類。チャット上に小さなラベルとして表示される */
export const MESSAGE_KINDS = {
  question: "質問",
  rebuttal: "反論",
  agree: "共感",
  fact: "事実確認",
  idea: "提案",
  summary: "まとめ",
} as const
export type MessageKind = keyof typeof MESSAGE_KINDS

export interface DiscussionMessage {
  speaker: string
  text: string
  kind?: MessageKind
  /** キャラクターの表情（character を持つ登場人物のみ有効） */
  expression?: CharacterExpression
  sourceIds?: string[]
}

export type DiscussionItem =
  | DiscussionMessage
  /** 話題の区切り */
  | { divider: string }
  /** ト書き（場の様子の描写。例：「店員さんがビールを運んでくる」） */
  | { narration: string }

/** 議論の場面設定 */
export interface Scene {
  /** 場所（例：駅前の焼き鳥屋） */
  place: string
  /** 時間（例：金曜の夜8時） */
  time: string
  /** 場面の説明 */
  description: string
  /** 場面を表す絵文字（任意） */
  emoji?: string
}

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
  scene?: Scene
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
  /** 議論の参加者（カードのアバター表示用） */
  participants: Pick<
    Participant,
    "id" | "name" | "icon" | "persona" | "character"
  >[]
  /** 議論の発言数 */
  messageCount: number
  /** 議論の冒頭の発言（プレビュー用） */
  firstMessage: { speaker: string; text: string } | null
}

/**
 * 記事の企画候補（content/article-plans.json）。
 * 未作成の記事であり、公開記事としては扱わない（ページは生成されない）。
 */
export const PLAN_STATUSES = ["idea", "researching", "writing"] as const
export type PlanStatus = (typeof PLAN_STATUSES)[number]

export interface ArticlePlan {
  /** 記事化するときの id（content/topics/{id}.json）の予定 */
  id: string
  title: string
  category: string
  tags: string[]
  status: PlanStatus
  /** 登場予定のキャラクター id */
  characters: string[]
  /** 執筆中の記事（下書き）があればその id。公開したら企画候補から外す */
  topicId?: string
  /** 問いの前提確認・参照予定の一次資料など編集メモ */
  notes?: string
}

export interface ArticlePlanGroup {
  id: string
  name: string
  plans: ArticlePlan[]
}
