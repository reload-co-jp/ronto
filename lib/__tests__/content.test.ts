import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { describe, expect, it } from "vitest"
import {
  categories,
  getRelatedTopics,
  getVisibleTopics,
  loadAllTopics,
  personas,
  readingTimeOf,
  resolveImage,
} from "../content"
import { TopicValidationError, validateTopic } from "../validate"

const ctx = {
  categoryIds: new Set(categories.map((c) => c.id)),
  personas: new Map(personas.map((p) => [p.id, p])),
}

const base = {
  id: "sample",
  title: "サンプル？",
  description: "概要",
  category: "economy",
  type: "why",
  status: "draft",
  tags: [],
}

describe("content/topics", () => {
  it("すべての記事データが検証を通る", () => {
    expect(() => loadAllTopics()).not.toThrow()
    expect(loadAllTopics().length).toBeGreaterThanOrEqual(20)
  })

  it("本番では published の記事のみ表示される", () => {
    const visible = getVisibleTopics()
    expect(visible.length).toBeGreaterThan(0)
    expect(visible.every((t) => t.status === "published")).toBe(true)
  })

  it("公開記事には出典がある", () => {
    for (const t of getVisibleTopics())
      expect(t.sources.length).toBeGreaterThan(0)
  })

  it("関連記事に自分自身や非公開記事を含まない", () => {
    const visibleIds = new Set(getVisibleTopics().map((t) => t.id))
    for (const t of getVisibleTopics())
      for (const r of getRelatedTopics(t)) {
        expect(r.id).not.toBe(t.id)
        expect(visibleIds.has(r.id)).toBe(true)
      }
  })

  it("読了目安は1分以上", () => {
    for (const t of loadAllTopics())
      expect(readingTimeOf(t)).toBeGreaterThanOrEqual(1)
  })
})

describe("validateTopic", () => {
  it("persona の値を引き継ぐ", () => {
    const t = validateTopic(
      { ...base, participants: [{ id: "m", persona: "moderator" }] },
      "sample.json",
      ctx
    )
    expect(t.participants[0].name).toBe("進行役")
    expect(t.participants[0].icon).toBe("compass")
  })

  it("中身のない記事は公開できない", () => {
    expect(() =>
      validateTopic({ ...base, status: "published" }, "sample.json", ctx)
    ).toThrow(TopicValidationError)
  })

  it("未定義の話者・出典・カテゴリを検出する", () => {
    try {
      validateTopic(
        {
          ...base,
          category: "unknown",
          discussion: [{ speaker: "ghost", text: "…", sourceIds: ["x"] }],
        },
        "sample.json",
        ctx
      )
      expect.unreachable()
    } catch (e) {
      const msg = (e as Error).message
      expect(msg).toContain("category")
      expect(msg).toContain("ghost")
      expect(msg).toContain("未定義の出典 x")
    }
  })

  it("id とファイル名の不一致を検出する", () => {
    expect(() => validateTopic(base, "other.json", ctx)).toThrow(/ファイル名/)
  })
})

describe("loadAllTopics", () => {
  it("_ で始まるファイルは無視する", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ronto-"))
    fs.writeFileSync(path.join(dir, "sample.json"), JSON.stringify(base))
    fs.writeFileSync(path.join(dir, "_ignored.json"), "{ broken")
    expect(loadAllTopics(dir).map((t) => t.id)).toEqual(["sample"])
  })
})

describe("resolveImage", () => {
  it("存在しない画像は null（フォールバック表示）", () => {
    expect(resolveImage("/images/topics/does-not-exist.webp")).toBeNull()
    expect(resolveImage("/og-default.png")).toBe("/og-default.png")
    expect(resolveImage(undefined)).toBeNull()
  })
})
