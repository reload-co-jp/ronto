import type { MetadataRoute } from "next"
import {
  categories,
  categoryPath,
  getVisibleTopics,
  topicPath,
} from "@/lib/content"
import { characterPath, characters } from "@/lib/characters"
import { absoluteUrl } from "@/lib/site"
import type { Topic } from "@/lib/types"

export const dynamic = "force-static"

/**
 * 記事に依存しない固定ページの最終更新日（YYYY-MM-DD）。
 * デプロイは shallow clone のため git の履歴から算出できない。
 * ページ本文やデータを更新したら、ここも合わせて更新する。
 */
const PAGE_UPDATED_AT = {
  "/about/": "2026-11-18",
  "/sources/": "2026-11-04",
  "/privacy/": "2026-11-04",
  "/elections/": "2026-11-04",
  "/characters/": "2026-11-06",
} as const

const topicUpdatedAt = (t: Topic) => t.updatedAt ?? t.publishedAt

/** 日付文字列のうち最も新しいもの（ISO 形式なので文字列比較でよい） */
const latestOf = (dates: (string | undefined)[]) =>
  dates
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop()

const sitemap = (): MetadataRoute.Sitemap => {
  const topics = getVisibleTopics().filter((t) => t.status === "published")
  const latestTopicOf = (list: Topic[]) => latestOf(list.map(topicUpdatedAt))
  const latest = latestTopicOf(topics)

  const staticPages: [string, string | undefined][] = [
    ["/", latest],
    ["/topics/", latest],
    ["/categories/", latest],
    ["/characters/", PAGE_UPDATED_AT["/characters/"]],
    [
      "/elections/",
      latestOf([
        PAGE_UPDATED_AT["/elections/"],
        latestTopicOf(topics.filter((t) => t.type === "election")),
      ]),
    ],
    ["/about/", PAGE_UPDATED_AT["/about/"]],
    ["/sources/", PAGE_UPDATED_AT["/sources/"]],
    ["/privacy/", PAGE_UPDATED_AT["/privacy/"]],
  ]

  return [
    ...staticPages.map(([p, lastModified]) => ({
      url: absoluteUrl(p),
      lastModified,
    })),
    ...categories.map((c) => ({
      url: absoluteUrl(categoryPath(c.id)),
      lastModified: latestTopicOf(topics.filter((t) => t.category === c.id)),
    })),
    ...characters.map((c) => ({
      url: absoluteUrl(characterPath(c.id)),
      lastModified: latestOf([
        PAGE_UPDATED_AT["/characters/"],
        latestTopicOf(
          topics.filter((t) => t.participants.some((p) => p.character === c.id))
        ),
      ]),
    })),
    ...topics.map((t) => ({
      url: absoluteUrl(topicPath(t.id)),
      lastModified: topicUpdatedAt(t),
    })),
  ]
}
export default sitemap
