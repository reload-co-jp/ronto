import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Discussion } from "../Discussion"
import { Participant } from "@/lib/types"

const participants: Participant[] = [
  {
    id: "m",
    persona: "moderator",
    name: "進行役",
    description: "",
    stance: "",
    concerns: [],
    icon: "compass",
  },
  {
    id: "c",
    name: "生活者の視点",
    description: "",
    stance: "",
    concerns: [],
    icon: "shopping-cart",
  },
]

describe("Discussion", () => {
  it("発言者名・発言・出典番号を表示する", () => {
    render(
      <Discussion
        participants={participants}
        sources={[
          {
            id: "s1",
            title: "資料",
            url: "https://example.com/",
            publisher: "省",
            accessedAt: "2026-11-01",
          },
        ]}
        items={[
          { divider: "はじめに" },
          { speaker: "m", text: "今日のテーマは？" },
          { speaker: "c", text: "家計の話です。", sourceIds: ["s1"] },
        ]}
      />
    )
    expect(screen.getByText("はじめに")).toBeInTheDocument()
    expect(screen.getByText("進行役")).toBeInTheDocument()
    expect(screen.getByText("家計の話です。")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /出典1/ })).toHaveAttribute(
      "href",
      "#source-s1"
    )
  })
})
