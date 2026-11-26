import type { Metadata } from "next"
import { absoluteUrl, site } from "./site"

/** ページ共通のメタデータ（canonical・OGP）を組み立てる */
export const pageMetadata = ({
  title,
  description,
  path,
  image,
  imageSize,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex,
}: {
  title?: string
  description: string
  path: string
  image?: string | null
  /** image を指定したときのサイズ。省略時は OGP 標準の 1200x630 とみなす */
  imageSize?: { width: number; height: number }
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
}): Metadata => {
  const size = (image && imageSize) || { width: 1200, height: 630 }
  const images = [{ url: image ?? site.ogImage, ...size }]
  // 横長でない画像（キャラクターの正方形画像など）は大きいカードにすると見切れる
  const card =
    size.width / size.height >= 1.5 ? "summary_large_image" : "summary"
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
      card,
      title: title ? `${title} | ${site.name}` : site.name,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}

/** 運営組織の構造化データ（publisher などに埋め込む） */
export const publisherJsonLd = {
  "@type": "Organization",
  name: site.publisher.name,
  url: site.publisher.url,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl(site.logo.url),
    width: site.logo.width,
    height: site.logo.height,
  },
} as const

/** 記事一覧ページの構造化データ（CollectionPage + ItemList） */
export const collectionJsonLd = ({
  name,
  description,
  path,
  items,
}: {
  name: string
  description: string
  path: string
  items: { name: string; path: string }[]
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url: absoluteUrl(path),
  inLanguage: "ja",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  },
})
