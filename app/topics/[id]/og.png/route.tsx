import { ImageResponse } from "next/og"
import {
  getArticleType,
  getCategory,
  getTopic,
  getVisibleTopics,
} from "@/lib/content"
import { loadOgFont } from "@/lib/og-font"
import { site } from "@/lib/site"

/** 記事ごとの OGP 画像（ビルド時に生成） */

export const dynamic = "force-static"
export const dynamicParams = false
const size = { width: 1200, height: 630 }

export const generateStaticParams = () =>
  getVisibleTopics().map((t) => ({ id: t.id }))

const NAVY = "#1f2b4d"
const ACCENT = "#e2672e"
const BG = "#f9f7f3"
const SUB = "#6b6f80"

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const topic = getTopic((await params).id)
  if (!topic) throw new Error("記事が見つからない")
  const category = getCategory(topic.category)!
  const type = getArticleType(topic.type)
  const brand = "RonTo."
  const footer = site.tagline
  // タイトルの長さに応じて文字サイズを下げ、3行に収める
  const titleSize =
    topic.title.length <= 16 ? 76 : topic.title.length <= 26 ? 64 : 54

  const [bold, black] = await Promise.all([
    loadOgFont(category.name + type.label + footer, 700),
    loadOgFont(topic.title + brand, 900),
  ])

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        fontFamily: "Zen Maru Gothic",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "64px 80px 48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              padding: "8px 24px",
              borderRadius: 999,
              background: category.color,
              color: "#fff",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            {category.name}
          </div>
          <div
            style={{
              display: "flex",
              padding: "6px 22px",
              borderRadius: 999,
              border: `3px solid ${NAVY}`,
              color: NAVY,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {type.label}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            color: NAVY,
            fontSize: titleSize,
            fontWeight: 900,
            lineHeight: 1.35,
            letterSpacing: "0.02em",
          }}
        >
          {topic.title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900 }}>
            <span style={{ color: NAVY }}>Ron</span>
            <span style={{ color: ACCENT }}>To.</span>
          </div>
          <div
            style={{
              display: "flex",
              color: SUB,
              fontSize: 28,
              fontWeight: 700,
              paddingBottom: 12,
            }}
          >
            {footer}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", height: 16, background: NAVY }} />
    </div>,
    {
      ...size,
      fonts: [
        { name: "Zen Maru Gothic", data: bold, weight: 700, style: "normal" },
        { name: "Zen Maru Gothic", data: black, weight: 900, style: "normal" },
      ],
    }
  )
}
