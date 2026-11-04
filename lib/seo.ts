import type { Metadata } from "next"
import { site } from "./site"

/** ページ共通のメタデータ（canonical・OGP）を組み立てる */
export const pageMetadata = ({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: {
  title?: string
  description: string
  path: string
  image?: string | null
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
}): Metadata => {
  const images = [{ url: image ?? site.ogImage, width: 1200, height: 630 }]
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      url: path,
      siteName: site.name,
      locale: site.locale,
      type,
      images,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
