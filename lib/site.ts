export const site = {
  name: "RonTo",
  url: "https://rnt.reload.co.jp",
  tagline: "社会のあれこれ、ちょっと考えてみよう。",
  description:
    "普段はあまり考えない政治や社会の疑問を、いろんな視点から。複数のAIがそれぞれの立場から話し合い、背景・論点・影響を整理する読み物メディアです。",
  concept: "政治を知らなくても、政治について考えられる場所。",
  publisher: {
    name: "株式会社リロード",
    url: "https://reload.co.jp/",
  },
  ogImage: "/og-default.png",
  locale: "ja_JP",
} as const

/** サイト内パスを絶対 URL に変換する */
export const absoluteUrl = (path: string) => new URL(path, site.url).toString()

/**
 * 下書き記事を表示するか。
 * 開発サーバー (next dev) または RONTO_PREVIEW=1 のときのみ true。
 * 本番ビルドでは常に published の記事だけが出力される。
 */
export const showDrafts =
  process.env.NODE_ENV === "development" || process.env.RONTO_PREVIEW === "1"
