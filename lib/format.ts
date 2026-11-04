/** YYYY-MM-DD を「2026年11月1日」形式にする */
export const formatDate = (iso?: string) => {
  if (!iso) return ""
  const [y, m, d] = iso.split("-").map(Number)
  return `${y}年${m}月${d}日`
}

/** <time dateTime> 用 */
export const isoDate = (iso?: string) => iso ?? ""
