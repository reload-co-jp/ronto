import fs from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  characterImage,
  characters,
  getCharacter,
  validateCharacters,
} from "../characters"
import {
  articlePlanGroups,
  categories,
  getTopicsByCharacter,
  loadAllTopics,
  personas,
} from "../content"
import { CHARACTER_EXPRESSIONS, PLAN_STATUSES } from "../types"
import { validateTopic } from "../validate"

const ctx = {
  categoryIds: new Set(categories.map((c) => c.id)),
  personas: new Map(personas.map((p) => [p.id, p])),
  characters: new Map(characters.map((c) => [c.id, c])),
}

describe("content/characters.json", () => {
  it("4匹の公式キャラクターが定義されている", () => {
    expect(characters.map((c) => c.id)).toEqual([
      "otter",
      "munchkin",
      "hamster",
      "penguin",
    ])
  })

  it("参照している画像ファイルがすべて存在する", () => {
    for (const c of characters) {
      expect(c.icon, `${c.id} の画像`).toBeTruthy()
      const files = [
        c.profileImage,
        c.icon,
        ...CHARACTER_EXPRESSIONS.map((e) => c.expressionImages[e]),
      ].filter(Boolean)
      for (const f of files) {
        expect(fs.existsSync(path.join(process.cwd(), "public", f!))).toBe(true)
      }
    }
  })

  it("関係は相互に定義されている", () => {
    for (const c of characters)
      for (const r of c.relationships)
        expect(
          getCharacter(r.characterId)!.relationships.some(
            (x) => x.characterId === c.id
          )
        ).toBe(true)
  })

  it("不正な関係を検出する", () => {
    const bad = {
      ...characters[0],
      relationships: [{ characterId: "nobody", label: "", description: "" }],
    }
    expect(() => validateCharacters([bad])).toThrow()
  })

  it("画像は 表情 → normal → アイコン の順にフォールバックする", () => {
    const c = { ...characters[0], expressionImages: { normal: "/n.svg" } }
    expect(characterImage(c, "happy")).toBe("/n.svg")
    expect(characterImage({ ...c, expressionImages: {} })).toBe(c.icon)
    expect(
      characterImage({
        ...c,
        expressionImages: {},
        icon: undefined,
        profileImage: undefined,
      })
    ).toBeNull()
  })
})

describe("記事とキャラクター", () => {
  const base = {
    id: "sample",
    title: "サンプル？",
    description: "概要",
    category: "religion",
    type: "why",
    status: "draft",
  }

  it("character の値を引き継ぎ、記事側で上書きできる", () => {
    const t = validateTopic(
      {
        ...base,
        participants: [
          { id: "a", character: "otter" },
          { id: "b", character: "munchkin", stance: "記事独自の視点" },
        ],
      },
      "sample.json",
      ctx
    )
    expect(t.participants[0]).toMatchObject({
      character: "otter",
      nickname: "カワウソ",
      icon: "compass",
    })
    expect(t.participants[1].stance).toBe("記事独自の視点")
  })

  it("未登録のキャラクターは下書きではフォールバック、公開記事ではエラー", () => {
    const raw = { ...base, participants: [{ id: "x", character: "unknown" }] }
    const t = validateTopic(raw, "sample.json", ctx)
    expect(t.participants[0].character).toBeUndefined()
    expect(t.participants[0].icon).toBe("user")
    expect(() =>
      validateTopic({ ...raw, status: "published" }, "sample.json", ctx)
    ).toThrow(/characters\.json にない/)
  })

  it("未対応の表情を検出する", () => {
    expect(() =>
      validateTopic(
        {
          ...base,
          participants: [{ id: "a", character: "otter" }],
          discussion: [{ speaker: "a", text: "やあ", expression: "angry" }],
        },
        "sample.json",
        ctx
      )
    ).toThrow(/expression/)
  })

  it("登場記事一覧は記事データから生成され、表示対象の記事だけを含む", () => {
    for (const c of characters)
      for (const t of getTopicsByCharacter(c.id)) {
        expect(t.status).toBe("published")
        expect(t.participants.some((p) => p.character === c.id)).toBe(true)
      }
  })
})

describe("content/article-plans.json", () => {
  const topics = new Map(loadAllTopics().map((t) => [t.id, t]))
  const plans = articlePlanGroups.flatMap((g) => g.plans)

  it("企画候補はカテゴリ・キャラクター・ステータスが正しい", () => {
    const categoryIds = new Set(categories.map((c) => c.id))
    for (const p of plans) {
      expect(categoryIds.has(p.category), p.id).toBe(true)
      expect(PLAN_STATUSES).toContain(p.status)
      for (const c of p.characters) expect(getCharacter(c), p.id).toBeTruthy()
    }
  })

  it("企画候補の id は重複せず、公開済み記事として扱わない", () => {
    expect(new Set(plans.map((p) => p.id)).size).toBe(plans.length)
    for (const p of plans) {
      const topic = topics.get(p.topicId ?? p.id)
      if (p.topicId) expect(topic, p.id).toBeTruthy()
      if (topic) expect(topic.status, p.id).not.toBe("published")
    }
  })
})
