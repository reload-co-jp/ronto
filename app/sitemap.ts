import type { MetadataRoute } from "next"
import {
  categories,
  categoryPath,
  getVisibleTopics,
  topicPath,
} from "@/lib/content"
import { characterPath, characters } from "@/lib/characters"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

const sitemap = (): MetadataRoute.Sitemap => {
  const topics = getVisibleTopics().filter((t) => t.status === "published")
  const latest = topics
    .map((t) => t.updatedAt ?? t.publishedAt)
    .sort()
    .pop()
  const staticPages = [
    "/",
    "/topics/",
    "/categories/",
    "/characters/",
    "/elections/",
    "/about/",
    "/sources/",
    "/privacy/",
  ]
  return [
    ...staticPages.map((p) => ({
      url: absoluteUrl(p),
      lastModified: p === "/" || p === "/topics/" ? latest : undefined,
    })),
    ...categories.map((c) => ({ url: absoluteUrl(categoryPath(c.id)) })),
    ...characters.map((c) => ({ url: absoluteUrl(characterPath(c.id)) })),
    ...topics.map((t) => ({
      url: absoluteUrl(topicPath(t.id)),
      lastModified: t.updatedAt ?? t.publishedAt,
    })),
  ]
}
export default sitemap
