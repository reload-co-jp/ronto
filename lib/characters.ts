import charactersJson from "@/content/characters.json"
import {
  Character,
  CHARACTER_EXPRESSIONS,
  CharacterExpression,
  ICON_NAMES,
} from "./types"

/**
 * キャラクター情報の一元管理。
 * fs に依存しないため、サーバー・クライアントどちらのコンポーネントからも利用できる。
 */

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** characters.json の整合性チェック。不正な場合は例外（ビルド・テストを失敗させる） */
export const validateCharacters = (list: Character[]): Character[] => {
  const problems: string[] = []
  const ids = new Set(list.map((c) => c.id))
  if (ids.size !== list.length) problems.push("キャラクターの id が重複")
  for (const c of list) {
    if (!ID_RE.test(c.id)) problems.push(`${c.id}: id の形式が不正`)
    for (const k of [
      "name",
      "species",
      "tagline",
      "description",
      "occupation",
      "shortTitle",
      "role",
      "catchphrase",
    ] as const)
      if (!c[k]) problems.push(`${c.id}: ${k} は必須`)
    if (!ICON_NAMES.includes(c.fallbackIcon))
      problems.push(`${c.id}: fallbackIcon が不正`)
    for (const key of Object.keys(c.expressionImages ?? {}))
      if (!CHARACTER_EXPRESSIONS.includes(key as CharacterExpression))
        problems.push(`${c.id}: 未対応の表情 ${key}`)
    for (const r of c.relationships)
      if (!ids.has(r.characterId) || r.characterId === c.id)
        problems.push(`${c.id}: relationships の ${r.characterId} が不正`)
  }
  if (problems.length > 0)
    throw new Error(
      `content/characters.json に問題があります:\n- ${problems.join("\n- ")}`
    )
  return list
}

export const characters = validateCharacters(charactersJson as Character[])

const byId = new Map(characters.map((c) => [c.id, c]))

export const getCharacter = (id?: string): Character | undefined =>
  id ? byId.get(id) : undefined

export const characterPath = (id: string) => `/characters/${id}/`

/**
 * 表示する画像。指定の表情 → normal → アイコン → プロフィール画像 の順にフォールバックし、
 * どれもなければ null（呼び出し側で線画アイコンを表示する）。
 */
export const characterImage = (
  c: Character,
  expression: CharacterExpression = "normal"
): string | null =>
  c.expressionImages[expression] ??
  c.expressionImages.normal ??
  c.icon ??
  c.profileImage ??
  null
