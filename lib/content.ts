import fs from "node:fs"
import path from "node:path"
import articleTypesJson from "@/content/article-types.json"
import categoriesJson from "@/content/categories.json"
import personasJson from "@/content/personas.json"
import { showDrafts } from "./site"
import {
  ArticleType,
  ArticleTypeId,
  Category,
  DiscussionMessage,
  Persona,
  Topic,
  TopicCardData,
} from "./types"
import { validateTopic } from "./validate"

/**
 * コンテンツの読み込み。ビルド時（サーバー側）にのみ実行される。
 * content/topics/*.json を追加するだけで一覧・詳細ページが生成される。
 */

const ROOT = process.cwd()
const TOPICS_DIR = path.join(ROOT, "content", "topics")
const PUBLIC_DIR = path.join(ROOT, "public")

export const categories: Category[] = categoriesJson
export const articleTypes = articleTypesJson as ArticleType[]
export const personas = personasJson as Persona[]

export const getCategory = (id: string) => categories.find((c) => c.id === id)
export const getArticleType = (id: ArticleTypeId) =>
  articleTypes.find((t) => t.id === id)!

let cache: Topic[] | null = null

/** すべての記事（ステータスを問わない）。データ不正時は例外 */
export const loadAllTopics = (dir = TOPICS_DIR): Topic[] => {
  if (cache && dir === TOPICS_DIR) return cache
  const ctx = {
    categoryIds: new Set(categories.map((c) => c.id)),
    personas: new Map(personas.map((x) => [x.id, x])),
  }
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
  const topics = files.map((f) =>
    validateTopic(
      JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")),
      f,
      ctx
    )
  )
  const ids = new Set(topics.map((t) => t.id))
  for (const t of topics)
    for (const r of t.related)
      if (!ids.has(r))
        throw new Error(`記事 ${t.id} の related に存在しない記事 ${r} がある`)
  if (dir === TOPICS_DIR) cache = topics
  return topics
}

const byNewest = (a: Topic, b: Topic) =>
  (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
  a.id.localeCompare(b.id)

/** 表示対象の記事。本番は published のみ、開発時は draft も含む（archived は常に除外） */
export const getVisibleTopics = (): Topic[] =>
  loadAllTopics()
    .filter(
      (t) => t.status === "published" || (showDrafts && t.status === "draft")
    )
    .sort(byNewest)

export const getTopic = (id: string) =>
  getVisibleTopics().find((t) => t.id === id)

export const getFeaturedTopics = () =>
  getVisibleTopics().filter((t) => t.featured)

export const getTopicsByCategory = (categoryId: string) =>
  getVisibleTopics().filter((t) => t.category === categoryId)

/** 関連記事: 明示指定 → 同カテゴリ → タグ共通 の順に最大 limit 件 */
export const getRelatedTopics = (topic: Topic, limit = 3): Topic[] => {
  const visible = getVisibleTopics().filter((t) => t.id !== topic.id)
  const score = (t: Topic) =>
    (topic.related.includes(t.id) ? 100 : 0) +
    (t.category === topic.category ? 10 : 0) +
    t.tags.filter((tag) => topic.tags.includes(tag)).length
  return visible
    .map((t) => ({ t, s: score(t) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || byNewest(a.t, b.t))
    .slice(0, limit)
    .map(({ t }) => t)
}

const collectText = (t: Topic): string =>
  [
    t.lead,
    ...t.sections.flatMap((s) =>
      s.blocks.flatMap((b) =>
        b.type === "list"
          ? b.items
          : b.type === "figures"
            ? b.items.map((f) => `${f.label}${f.value}${f.note ?? ""}`)
            : [b.text]
      )
    ),
    ...t.discussion.map((d) => ("text" in d ? d.text : "")),
    ...Object.values(t.summary).flatMap((v) =>
      (v as unknown[]).map((x) =>
        typeof x === "string" ? x : Object.values(x as object).join("")
      )
    ),
    ...t.takeaways,
    ...t.furtherQuestions,
  ].join("")

/** 読了目安（分）。データに指定がなければ 1分=500字 で算出 */
export const readingTimeOf = (t: Topic) =>
  t.readingTime ?? Math.max(1, Math.ceil(collectText(t).length / 500))

/** public 配下に画像が存在すればそのパスを、なければ null を返す */
export const resolveImage = (src?: string): string | null => {
  if (!src) return null
  return fs.existsSync(path.join(PUBLIC_DIR, src)) ? src : null
}

export const toCardData = (t: Topic): TopicCardData => ({
  id: t.id,
  title: t.title,
  description: t.description,
  category: getCategory(t.category)!,
  type: getArticleType(t.type),
  publishedAt: t.publishedAt,
  updatedAt: t.updatedAt,
  readingTime: readingTimeOf(t),
  thumbnail: resolveImage(t.thumbnail),
  status: t.status,
  participants: t.participants.map(({ id, name, icon, persona }) => ({
    id,
    name,
    icon,
    persona,
  })),
  messageCount: t.discussion.filter((d) => "speaker" in d).length,
  firstMessage: (() => {
    const m = t.discussion.find((d): d is DiscussionMessage => "speaker" in d)
    return m ? { speaker: m.speaker, text: m.text } : null
  })(),
})

export const topicPath = (id: string) => `/topics/${id}/`
export const categoryPath = (id: string) => `/categories/${id}/`
