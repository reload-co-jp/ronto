/* global process, console */
/**
 * キャラクター画像（SVG）の生成スクリプト。
 *
 *   node scripts/generate-character-art.mjs
 *
 * 4匹のキャラクターを同じ線幅・同じ頭身・同じ表情パーツで描き、
 * public/images/characters/ 配下に書き出す。生成物はリポジトリにコミットする。
 * 絵柄を変えるときはこのスクリプトを編集して再実行する。
 */
import fs from "node:fs"
import path from "node:path"

const OUT = path.join(process.cwd(), "public", "images", "characters")
const INK = "#2b2a33"
const SW = 4 // 共通の線幅
const MOUTH = "#e2546a"
const BLUSH = "#ff9fb0"

export const EXPRESSIONS = [
  "normal",
  "happy",
  "surprised",
  "confused",
  "thinking",
  "serious",
]

/* ---------- 表情パーツ（全キャラ共通） ---------- */

const eye = (x, y, e, side, light = false) => {
  const c = light ? "#fff" : INK
  switch (e) {
    case "happy":
      return `<path d="M${x - 8} ${y + 3} Q${x} ${y - 8} ${x + 8} ${y + 3}" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`
    case "surprised":
      return `<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="${INK}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="4.5" fill="${INK}"/>`
    case "confused":
      if (side === "r")
        return `<path d="M${x + 6} ${y - 6} L${x - 5} ${y} L${x + 6} ${y + 6}" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
      return `<circle cx="${x}" cy="${y}" r="6" fill="${c}"/>`
    case "thinking":
      return `<circle cx="${x}" cy="${y}" r="7.5" fill="#fff" stroke="${INK}" stroke-width="2.5"/><circle cx="${x + 3}" cy="${y - 3}" r="4.5" fill="${INK}"/>`
    case "serious":
      return `<circle cx="${x}" cy="${y + 1}" r="6" fill="${c}"/><path d="M${x - 10} ${y - 4} L${x + 10} ${y - 4}" stroke="${c}" stroke-width="4" stroke-linecap="round"/>`
    default:
      return `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle cx="${x - 2.2}" cy="${y - 2.4}" r="2.3" fill="#fff"/>`
  }
}

const brows = (l, r, e, light = false) => {
  const c = light ? "#fff" : INK
  const line = (d) =>
    `<path d="${d}" fill="none" stroke="${c}" stroke-width="3.5" stroke-linecap="round"/>`
  switch (e) {
    case "surprised":
      return (
        line(
          `M${l.x - 8} ${l.y - 20} Q${l.x} ${l.y - 26} ${l.x + 8} ${l.y - 20}`
        ) +
        line(
          `M${r.x - 8} ${r.y - 20} Q${r.x} ${r.y - 26} ${r.x + 8} ${r.y - 20}`
        )
      )
    case "confused":
      return (
        line(`M${l.x - 8} ${l.y - 16} L${l.x + 8} ${l.y - 19}`) +
        line(
          `M${r.x - 8} ${r.y - 21} Q${r.x} ${r.y - 15} ${r.x + 8} ${r.y - 17}`
        )
      )
    case "thinking":
      return (
        line(`M${l.x - 8} ${l.y - 17} L${l.x + 8} ${l.y - 17}`) +
        line(`M${r.x - 8} ${r.y - 19} L${r.x + 8} ${r.y - 22}`)
      )
    case "serious":
      return (
        line(`M${l.x - 9} ${l.y - 19} L${l.x + 8} ${l.y - 14}`) +
        line(`M${r.x - 8} ${r.y - 14} L${r.x + 9} ${r.y - 19}`)
      )
    default:
      return ""
  }
}

const mouth = (x, y, e) => {
  const st = `stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"`
  switch (e) {
    case "happy":
      return `<path d="M${x - 11} ${y - 1} Q${x} ${y + 17} ${x + 11} ${y - 1} Z" fill="${MOUTH}" ${st}/>`
    case "surprised":
      return `<ellipse cx="${x}" cy="${y + 4}" rx="6" ry="8" fill="${MOUTH}" ${st}/>`
    case "confused":
      return `<path d="M${x - 10} ${y + 3} q5 -5 10 0 q5 5 10 0" fill="none" ${st}/>`
    case "thinking":
      return `<path d="M${x - 3} ${y + 3} L${x + 8} ${y + 1}" fill="none" ${st}/>`
    case "serious":
      return `<path d="M${x - 8} ${y + 3} L${x + 8} ${y + 3}" fill="none" ${st}/>`
    default:
      return `<path d="M${x - 8} ${y} Q${x} ${y + 8} ${x + 8} ${y}" fill="none" ${st}/>`
  }
}

const extras = (e, r) => {
  if (e === "confused")
    return `<path d="M${r.x + 34} ${r.y - 34} q-8 12 0 16 q8 -4 0 -16z" fill="#8ccff5" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`
  if (e === "thinking")
    return `<circle cx="${r.x + 36}" cy="${r.y - 30}" r="3.5" fill="${INK}"/><circle cx="${r.x + 46}" cy="${r.y - 42}" r="5" fill="${INK}"/><circle cx="${r.x + 58}" cy="${r.y - 58}" r="7" fill="${INK}"/>`
  if (e === "surprised")
    return `<path d="M${r.x + 36} ${r.y - 44} l4 14 M${r.x + 50} ${r.y - 36} l-8 10 M${r.x + 26} ${r.y - 48} l1 12" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
  if (e === "happy")
    return `<path d="M${r.x + 38} ${r.y - 40} l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#ffc94a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`
  return ""
}

const face = ({ l, r, m, light, blush }, e) =>
  (blush
    ? `<ellipse cx="${blush[0].x}" cy="${blush[0].y}" rx="10" ry="6" fill="${BLUSH}" opacity="0.8"/><ellipse cx="${blush[1].x}" cy="${blush[1].y}" rx="10" ry="6" fill="${BLUSH}" opacity="0.8"/>`
    : "") +
  brows(l, r, e, light) +
  eye(l.x, l.y, e, "l", light) +
  eye(r.x, r.y, e, "r", light) +
  mouth(m.x, m.y, e) +
  extras(e, r)

const ow = (w = SW) =>
  `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"`
const o = ow()

/* ---------- キャラクター本体（200×200 のバストアップ） ---------- */

export const species = {
  otter: {
    color: { main: "#f2792e", bg: "#ffe1cc" },
    body: `
      <path d="M44 200 Q48 160 100 158 Q152 160 156 200 Z" fill="#a8714a" ${o}/>
      <path d="M78 200 Q80 172 100 170 Q120 172 122 200 Z" fill="#f2dcc2"/>
      <path d="M66 166 L84 200 M134 166 L116 200" stroke="#f2792e" stroke-width="5" stroke-linecap="round"/>
      <rect x="108" y="180" width="22" height="16" rx="3" fill="#fff" ${ow(3)}/>
      <path d="M113 186 h12 M113 191 h8" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
    head: `
      <circle cx="54" cy="70" r="13" fill="#9a6440" ${o}/>
      <circle cx="146" cy="70" r="13" fill="#9a6440" ${o}/>
      <ellipse cx="100" cy="108" rx="58" ry="52" fill="#a8714a" ${o}/>
      <path d="M58 120 Q62 158 100 160 Q138 158 142 120 Q128 104 100 108 Q72 104 58 120 Z" fill="#f2dcc2"/>
      <path d="M86 58 q6 -10 14 -4 q6 -10 14 2" fill="none" stroke="#7c4e30" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="100" cy="120" rx="10" ry="7" fill="${INK}"/>
      <path d="M62 126 l-18 -3 M62 132 l-17 4 M138 126 l18 -3 M138 132 l17 4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
    face: {
      l: { x: 76, y: 100 },
      r: { x: 124, y: 100 },
      m: { x: 100, y: 134 },
      blush: [
        { x: 68, y: 122 },
        { x: 132, y: 122 },
      ],
    },
  },
  munchkin: {
    color: { main: "#5866e0", bg: "#dfe3ff" },
    body: `
      <path d="M46 200 Q50 160 100 158 Q150 160 154 200 Z" fill="#fff" ${o}/>
      <path d="M100 160 L86 200 M100 160 L114 200" stroke="${INK}" stroke-width="3"/>
      <path d="M90 164 L100 176 L110 164" fill="#5866e0" ${ow(3)}/>`,
    head: `
      <path d="M50 88 L56 34 L94 62 Z" fill="#c9c3bb" ${o}/>
      <path d="M150 88 L144 34 L106 62 Z" fill="#c9c3bb" ${o}/>
      <path d="M60 74 L62 48 L82 64 Z M140 74 L138 48 L118 64 Z" fill="#ffc4cf"/>
      <ellipse cx="100" cy="112" rx="62" ry="50" fill="#c9c3bb" ${o}/>
      <path d="M90 64 l2 14 M100 62 v16 M110 64 l-2 14 M40 108 l14 2 M42 122 l13 -2 M160 108 l-14 2 M158 122 l-13 -2" stroke="#8d857c" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="130" rx="26" ry="18" fill="#fff"/>
      <path d="M94 121 h12 l-6 7 z" fill="#f08aa0" ${ow(2.5)}/>`,
    face: {
      l: { x: 76, y: 106 },
      r: { x: 124, y: 106 },
      m: { x: 100, y: 136 },
    },
    // 研究員の丸メガネ（表情パーツの上に重ねる）
    overlay: `
      <circle cx="76" cy="106" r="16" fill="none" ${ow(3)}/>
      <circle cx="124" cy="106" r="16" fill="none" ${ow(3)}/>
      <path d="M92 104 Q100 99 108 104 M60 104 L44 100 M140 104 L156 100" fill="none" ${ow(3)}/>`,
  },
  hamster: {
    color: { main: "#e2a40c", bg: "#fff1c7" },
    body: `
      <path d="M42 200 Q46 160 100 158 Q154 160 158 200 Z" fill="#f4f1ec" ${o}/>
      <path d="M70 200 Q72 176 100 174 Q128 176 130 200" fill="#2fae7c" ${ow(3)}/>
      <rect x="86" y="182" width="28" height="14" rx="3" fill="#fff" ${ow(2.5)}/>
      <path d="M92 189 h16" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
    head: `
      <circle cx="56" cy="66" r="15" fill="#d6cdc2" ${o}/>
      <circle cx="144" cy="66" r="15" fill="#d6cdc2" ${o}/>
      <circle cx="56" cy="66" r="7" fill="#ffc4cf"/>
      <circle cx="144" cy="66" r="7" fill="#ffc4cf"/>
      <path d="M38 118 Q36 64 100 58 Q164 64 162 118 Q166 160 100 162 Q34 160 38 118 Z" fill="#f4f1ec" ${o}/>
      <path d="M42 102 Q50 62 100 60 Q150 62 158 102 Q130 88 100 90 Q70 88 42 102 Z" fill="#b5aca2"/>
      <path d="M100 62 V86" stroke="#6f655c" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="100" cy="122" rx="5" ry="3.5" fill="#f08aa0"/>`,
    face: {
      l: { x: 78, y: 108 },
      r: { x: 122, y: 108 },
      m: { x: 100, y: 130 },
      blush: [
        { x: 60, y: 128 },
        { x: 140, y: 128 },
      ],
    },
  },
  penguin: {
    color: { main: "#2a9cbb", bg: "#d4eef5" },
    body: `
      <path d="M44 200 Q48 158 100 156 Q152 158 156 200 Z" fill="#2f3340" ${o}/>
      <path d="M70 200 Q72 170 100 168 Q128 170 130 200 Z" fill="#fff"/>
      <path d="M72 186 Q100 176 128 186" fill="none" stroke="#2f3340" stroke-width="6"/>
      <path d="M86 160 L100 168 L86 176 Z M114 160 L100 168 L114 176 Z" fill="#2a9cbb" ${ow(3)}/>`,
    head: `
      <ellipse cx="100" cy="108" rx="58" ry="56" fill="#2f3340" ${o}/>
      <path d="M58 92 Q56 150 100 156 Q144 150 142 92" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="100" cy="116" rx="36" ry="30" fill="#eef1f5"/>
      <ellipse cx="86" cy="124" rx="8" ry="5" fill="#f4a3a8"/>
      <ellipse cx="114" cy="124" rx="8" ry="5" fill="#f4a3a8"/>
      <path d="M90 118 Q100 112 110 118 L100 130 Z" fill="${INK}" ${ow(3)}/>`,
    face: {
      l: { x: 82, y: 106 },
      r: { x: 118, y: 106 },
      m: { x: 100, y: 138 },
    },
  },
}

const svg = (viewBox, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${body.replace(/\s*\n\s*/g, "")}</svg>\n`

const figure = (s, e) => s.body + s.head + face(s.face, e) + (s.overlay ?? "")

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

const names = {
  otter: "コツメカワウソ",
  munchkin: "マンチカン",
  hamster: "ジャンガリアンハムスター",
  penguin: "フンボルトペンギン",
}

for (const [id, s] of Object.entries(species)) {
  for (const e of EXPRESSIONS)
    write(
      path.join(OUT, id, `${e}.svg`),
      svg("0 0 200 200", figure(s, e), names[id])
    )
  // アイコン：頭部を中心に切り出し、キャラクター色の円を敷く
  write(
    path.join(OUT, id, "icon.svg"),
    svg(
      "20 30 160 160",
      `<circle cx="100" cy="110" r="78" fill="${s.color.bg}"/>` +
        figure(s, "normal"),
      names[id]
    )
  )
  // プロフィール用メインビジュアル
  write(
    path.join(OUT, id, "profile.svg"),
    svg(
      "0 0 240 240",
      `<defs><clipPath id="frame"><rect x="4" y="4" width="232" height="232" rx="36"/></clipPath></defs>` +
        `<rect x="4" y="4" width="232" height="232" rx="36" fill="${s.color.bg}"/>` +
        `<circle cx="200" cy="44" r="14" fill="${s.color.main}" opacity="0.35"/>` +
        `<circle cx="34" cy="70" r="9" fill="${s.color.main}" opacity="0.35"/>` +
        `<g clip-path="url(#frame)"><svg x="4" y="8" width="232" height="232" viewBox="0 0 200 200">${figure(s, "happy")}</svg></g>` +
        `<rect x="4" y="4" width="232" height="232" rx="36" fill="none" ${o}/>`,
      names[id]
    )
  )
}

// 4匹の集合イラスト
const order = ["otter", "munchkin", "hamster", "penguin"]
const group =
  `<rect width="880" height="300" rx="40" fill="#fff3dc"/>` +
  `<ellipse cx="440" cy="292" rx="400" ry="22" fill="#ffc94a" opacity="0.5"/>` +
  order
    .map((id, i) => {
      const s = species[id]
      const x = 30 + i * 210
      return (
        `<circle cx="${x + 100}" cy="${130}" r="92" fill="${s.color.bg}"/>` +
        `<svg x="${x}" y="${88}" width="200" height="200" viewBox="0 0 200 200" overflow="hidden">${figure(s, i % 2 ? "normal" : "happy")}</svg>`
      )
    })
    .join("")
write(
  path.join(OUT, "group.svg"),
  svg("0 0 880 300", group, "RonToの4匹のキャラクター")
)

console.log(`wrote character art to ${path.relative(process.cwd(), OUT)}`)
