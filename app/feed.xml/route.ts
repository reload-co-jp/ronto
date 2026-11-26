import { getCategory, getVisibleTopics, topicPath } from "@/lib/content"
import { absoluteUrl, site } from "@/lib/site"

export const dynamic = "force-static"

const escape = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!
  )

/** RSS 2.0 フィード（公開済み記事を新しい順に） */
export const GET = () => {
  const topics = getVisibleTopics().filter((t) => t.status === "published")
  const lastBuildDate = topics
    .map((t) => t.updatedAt ?? t.publishedAt)
    .sort()
    .pop()
  const items = topics
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((t) => {
      const url = absoluteUrl(topicPath(t.id))
      return `<item><title>${escape(t.title)}</title><link>${url}</link><guid>${url}</guid><description>${escape(t.description)}</description><pubDate>${new Date(t.publishedAt).toUTCString()}</pubDate><category>${escape(getCategory(t.category)?.name ?? t.category)}</category></item>`
    })
    .join("")
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(site.name)}</title><link>${site.url}/</link><atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/><description>${escape(site.description)}</description><language>ja</language>${lastBuildDate ? `<lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>` : ""}${items}</channel></rss>`
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
