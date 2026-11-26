/**
 * OGP 画像生成用のフォント取得。
 * 日本語フォント全体をリポジトリに同梱しないよう、Google Fonts の text= 指定で
 * 画像に描く文字だけのサブセット（TrueType）をビルド時に取得する。
 */

const FAMILY = "Zen Maru Gothic"

const fetchWithRetry = async (url: string, init?: RequestInit) => {
  let lastError: unknown
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, init)
      if (res.ok) return res
      lastError = new Error(`${res.status} ${res.statusText}: ${url}`)
    } catch (e) {
      lastError = e
    }
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
  }
  throw lastError
}

/** text に含まれる文字だけを収録したフォントを取得する */
export const loadOgFont = async (
  text: string,
  weight: 700 | 900
): Promise<ArrayBuffer> => {
  const chars = [...new Set(text)].join("")
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    FAMILY
  )}:wght@${weight}&text=${encodeURIComponent(chars)}`
  // User-Agent を付けないと TrueType 形式の URL が返る（Satori は woff2 非対応）
  const css = await (await fetchWithRetry(cssUrl)).text()
  const src = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)
  if (!src) throw new Error(`OGP 用フォントの URL を取得できない: ${cssUrl}`)
  return (await fetchWithRetry(src[1])).arrayBuffer()
}
