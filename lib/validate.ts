import {
  ARTICLE_TYPE_IDS,
  Block,
  Character,
  CHARACTER_EXPRESSIONS,
  DiscussionItem,
  ICON_NAMES,
  MESSAGE_KINDS,
  Participant,
  Persona,
  Section,
  Source,
  Summary,
  TOPIC_STATUSES,
  Topic,
} from "./types"

/**
 * 記事 JSON の検証。ビルド時に実行され、不正なデータがあればビルドを失敗させる。
 * 外部ライブラリに依存しない最小限のスキーマチェック。
 */

type Raw = Record<string, unknown>

export class TopicValidationError extends Error {
  constructor(
    public readonly file: string,
    public readonly problems: string[]
  ) {
    super(`記事データ ${file} に問題があります:\n- ${problems.join("\n- ")}`)
    this.name = "TopicValidationError"
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const isObj = (v: unknown): v is Raw =>
  typeof v === "object" && v !== null && !Array.isArray(v)
const isStr = (v: unknown): v is string => typeof v === "string"
const isStrArr = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every(isStr)

interface Context {
  categoryIds: Set<string>
  personas: Map<string, Persona>
  /** 公式キャラクター（content/characters.json） */
  characters?: Map<string, Character>
}

/** 未登録キャラクターのフォールバック */
const unknownCharacterDefaults = {
  name: "登場人物",
  description: "キャラクター情報は準備中です。",
  stance: "",
  concerns: [],
  icon: "user",
}

/** キャラクターから登場人物の既定値を作る（記事側の値で上書きできる） */
const characterDefaults = (c: Character) => ({
  nickname: c.name,
  profile: `${c.species}・${c.occupation}`,
  name: c.shortTitle,
  description: c.description,
  stance: c.role,
  concerns: c.specialties,
  icon: c.fallbackIcon,
})

export const validateTopic = (
  raw: unknown,
  file: string,
  ctx: Context
): Topic => {
  const p: string[] = []
  if (!isObj(raw))
    throw new TopicValidationError(file, ["オブジェクトではない"])

  const str = (key: string, required = true): string | undefined => {
    const v = raw[key]
    if (v === undefined || v === "") {
      if (required) p.push(`${key} は必須`)
      return undefined
    }
    if (!isStr(v)) {
      p.push(`${key} は文字列`)
      return undefined
    }
    return v
  }
  const date = (key: string, v: unknown) => {
    if (v === undefined) return undefined
    if (!isStr(v) || !DATE_RE.test(v)) {
      p.push(`${key} は YYYY-MM-DD 形式`)
      return undefined
    }
    return v
  }
  const arr = <T>(key: string, fn: (v: unknown, i: number) => T): T[] => {
    const v = raw[key]
    if (v === undefined) return []
    if (!Array.isArray(v)) {
      p.push(`${key} は配列`)
      return []
    }
    return v.map(fn)
  }

  const id = str("id") ?? ""
  if (id && !ID_RE.test(id)) p.push("id は半角英小文字・数字・ハイフンのみ")
  const expectedId = file
    .replace(/\.json$/, "")
    .split("/")
    .pop()
  if (id && id !== expectedId) p.push(`id (${id}) とファイル名を一致させる`)

  const title = str("title") ?? ""
  const status = str("status") as Topic["status"]
  if (status && !TOPIC_STATUSES.includes(status))
    p.push(`status は ${TOPIC_STATUSES.join("/")} のいずれか`)
  const category = str("category") ?? ""
  if (category && !ctx.categoryIds.has(category))
    p.push(`category (${category}) が categories.json にない`)
  const type = str("type") as Topic["type"]
  if (type && !ARTICLE_TYPE_IDS.includes(type))
    p.push(`type は ${ARTICLE_TYPE_IDS.join("/")} のいずれか`)

  const published = status === "published"
  const description = str("description", published) ?? ""
  const lead = str("lead", false)
  const publishedAt = date("publishedAt", raw.publishedAt)
  const updatedAt = date("updatedAt", raw.updatedAt)
  const thumbnail = str("thumbnail", false)
  if (thumbnail && !thumbnail.startsWith("/"))
    p.push("thumbnail は / から始まるパス")

  const readingTime = raw.readingTime
  if (
    readingTime !== undefined &&
    (typeof readingTime !== "number" || readingTime <= 0)
  )
    p.push("readingTime は正の数")

  if (raw.tags !== undefined && !isStrArr(raw.tags))
    p.push("tags は文字列の配列")

  const sources: Source[] = arr("sources", (s, i) => {
    if (!isObj(s)) {
      p.push(`sources[${i}] はオブジェクト`)
      return null as unknown as Source
    }
    for (const k of ["id", "title", "url", "publisher", "accessedAt"])
      if (!isStr(s[k]) || s[k] === "") p.push(`sources[${i}].${k} は必須`)
    if (isStr(s.url) && !/^https?:\/\//.test(s.url))
      p.push(`sources[${i}].url は http(s) URL`)
    date(`sources[${i}].publishedAt`, s.publishedAt)
    date(`sources[${i}].accessedAt`, s.accessedAt)
    return s as unknown as Source
  }).filter(Boolean)
  const sourceIds = new Set(sources.map((s) => s.id))
  if (sourceIds.size !== sources.length) p.push("sources の id が重複")
  const checkRefs = (where: string, ids: unknown) => {
    if (ids === undefined) return
    if (!isStrArr(ids)) return p.push(`${where}.sourceIds は文字列の配列`)
    for (const sid of ids)
      if (!sourceIds.has(sid)) p.push(`${where} が未定義の出典 ${sid} を参照`)
  }

  const participants: Participant[] = arr("participants", (v, i) => {
    if (!isObj(v)) {
      p.push(`participants[${i}] はオブジェクト`)
      return null as unknown as Participant
    }
    const persona = isStr(v.persona) ? ctx.personas.get(v.persona) : undefined
    if (v.persona !== undefined && !persona)
      p.push(`participants[${i}].persona (${String(v.persona)}) が未定義`)
    let character: Character | undefined
    if (v.character !== undefined) {
      character = isStr(v.character)
        ? ctx.characters?.get(v.character)
        : undefined
      // 未登録のキャラクターは公開記事ではエラー。下書きでは通常の登場人物として表示する
      if (!character && published)
        p.push(
          `participants[${i}].character (${String(v.character)}) が characters.json にない`
        )
    }
    const merged = {
      ...persona,
      ...(character
        ? characterDefaults(character)
        : v.character !== undefined
          ? unknownCharacterDefaults
          : {}),
      ...v,
    } as Raw
    for (const k of ["id", "name", "description", "stance"])
      if (!isStr(merged[k])) p.push(`participants[${i}].${k} は必須`)
    if (!ICON_NAMES.includes(merged.icon as never))
      p.push(`participants[${i}].icon は ${ICON_NAMES.join("/")} のいずれか`)
    return {
      id: merged.id as string,
      persona: persona?.id,
      ...(character ? { character: character.id } : {}),
      name: merged.name as string,
      description: merged.description as string,
      stance: merged.stance as string,
      concerns: isStrArr(merged.concerns) ? merged.concerns : [],
      icon: merged.icon as Participant["icon"],
      ...(isStr(merged.nickname) ? { nickname: merged.nickname } : {}),
      ...(isStr(merged.profile) ? { profile: merged.profile } : {}),
    }
  }).filter(Boolean)
  const speakerIds = new Set(participants.map((x) => x.id))

  const block = (b: unknown, where: string): Block => {
    if (!isObj(b)) {
      p.push(`${where} はオブジェクト`)
      return { type: "paragraph", text: "" }
    }
    switch (b.type) {
      case "paragraph":
      case "callout":
        if (!isStr(b.text)) p.push(`${where}.text は必須`)
        checkRefs(where, b.sourceIds)
        break
      case "list":
        if (!isStrArr(b.items)) p.push(`${where}.items は文字列の配列`)
        break
      case "figures":
        if (!Array.isArray(b.items)) p.push(`${where}.items は配列`)
        else
          b.items.forEach((f, j) => {
            if (!isObj(f) || !isStr(f.label) || !isStr(f.value))
              p.push(`${where}.items[${j}] は label と value が必須`)
            else checkRefs(`${where}.items[${j}]`, f.sourceIds)
          })
        break
      default:
        p.push(`${where}.type (${String(b.type)}) は未対応`)
    }
    return b as unknown as Block
  }

  const sections: Section[] = arr("sections", (s, i) => {
    if (
      !isObj(s) ||
      !isStr(s.id) ||
      !isStr(s.heading) ||
      !Array.isArray(s.blocks)
    ) {
      p.push(`sections[${i}] は id・heading・blocks が必須`)
      return null as unknown as Section
    }
    return {
      id: s.id,
      heading: s.heading,
      blocks: s.blocks.map((b, j) => block(b, `sections[${i}].blocks[${j}]`)),
    }
  }).filter(Boolean)

  const discussion: DiscussionItem[] = arr("discussion", (d, i) => {
    if (isObj(d) && isStr(d.divider)) return { divider: d.divider }
    if (isObj(d) && isStr(d.narration)) return { narration: d.narration }
    if (!isObj(d) || !isStr(d.speaker) || !isStr(d.text)) {
      p.push(`discussion[${i}] は speaker と text が必須`)
      return { divider: "" }
    }
    if (!speakerIds.has(d.speaker))
      p.push(`discussion[${i}].speaker (${d.speaker}) が participants にない`)
    if (d.kind !== undefined && !(String(d.kind) in MESSAGE_KINDS))
      p.push(
        `discussion[${i}].kind は ${Object.keys(MESSAGE_KINDS).join("/")} のいずれか`
      )
    if (
      d.expression !== undefined &&
      !CHARACTER_EXPRESSIONS.includes(d.expression as never)
    )
      p.push(
        `discussion[${i}].expression は ${CHARACTER_EXPRESSIONS.join("/")} のいずれか`
      )
    checkRefs(`discussion[${i}]`, d.sourceIds)
    return d as unknown as DiscussionItem
  })

  let scene: Topic["scene"]
  if (raw.scene !== undefined) {
    const sc = raw.scene
    if (
      !isObj(sc) ||
      !isStr(sc.place) ||
      !isStr(sc.time) ||
      !isStr(sc.description)
    )
      p.push("scene は place・time・description が必須")
    else scene = sc as unknown as Topic["scene"]
  }

  const rs = isObj(raw.summary) ? raw.summary : {}
  const strList = (key: string) => {
    const v = rs[key]
    if (v === undefined) return []
    if (!isStrArr(v)) p.push(`summary.${key} は文字列の配列`)
    return isStrArr(v) ? v : []
  }
  const summary: Summary = {
    points: strList("points"),
    argumentsFor: strList("argumentsFor"),
    argumentsAgainst: strList("argumentsAgainst"),
    affectedParties: Array.isArray(rs.affectedParties)
      ? rs.affectedParties.filter((a, i) => {
          const ok = isObj(a) && isStr(a.who) && isStr(a.impact)
          if (!ok)
            p.push(`summary.affectedParties[${i}] は who と impact が必須`)
          return ok
        })
      : [],
    knownFacts: Array.isArray(rs.knownFacts)
      ? rs.knownFacts.filter((f, i) => {
          const ok = isObj(f) && isStr(f.text)
          if (!ok) p.push(`summary.knownFacts[${i}] は text が必須`)
          else {
            date(`summary.knownFacts[${i}].asOf`, f.asOf)
            checkRefs(`summary.knownFacts[${i}]`, f.sourceIds)
          }
          return ok
        })
      : [],
    openQuestions: strList("openQuestions"),
  }

  const strArrField = (key: string) => {
    const v = raw[key]
    if (v === undefined) return []
    if (!isStrArr(v)) p.push(`${key} は文字列の配列`)
    return isStrArr(v) ? v : []
  }

  // 公開記事は「中身のある記事」であることを保証する
  if (published) {
    if (!publishedAt) p.push("公開記事には publishedAt が必須")
    if (sources.length === 0) p.push("公開記事には出典 (sources) が1件以上必要")
    if (sections.length === 0) p.push("公開記事には sections が必要")
    const messages = discussion.filter((d) => "speaker" in d).length
    if (messages < 6)
      p.push("公開記事の discussion（メインコンテンツ）は発言6件以上が必要")
    if (summary.points.length === 0)
      p.push("公開記事には summary.points が必要")
  }

  if (p.length > 0) throw new TopicValidationError(file, p)

  return {
    id,
    title,
    description,
    lead,
    category,
    type,
    publishedAt,
    updatedAt,
    status,
    featured: raw.featured === true,
    readingTime: readingTime as number | undefined,
    thumbnail,
    tags: isStrArr(raw.tags) ? raw.tags : [],
    participants,
    scene,
    sections,
    discussion,
    summary,
    takeaways: strArrField("takeaways"),
    furtherQuestions: strArrField("furtherQuestions"),
    sources,
    related: strArrField("related"),
    editorial: isObj(raw.editorial)
      ? (raw.editorial as unknown as Topic["editorial"])
      : undefined,
  }
}
