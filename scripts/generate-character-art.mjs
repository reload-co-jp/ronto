/* global process, console */
/**
 * キャラクター画像（SVG）の生成スクリプト。
 *
 *   node scripts/generate-character-art.mjs
 *
 * 4匹のキャラクターを同じ線幅・同じ頭身・同じ表情パーツ（萌え調の瞳）で描き、
 * public/images/characters/ 配下に書き出す。生成物はリポジトリにコミットする。
 * 絵柄を変えるときはこのスクリプトを編集して再実行する。
 */
import fs from "node:fs"
import path from "node:path"

const OUT = path.join(process.cwd(), "public", "images", "characters")
const INK = "#5a4545" // やわらかい焦げ茶の線
const EYE = "#3b2c2c"
const SW = 3.5 // 共通の線幅
const MOUTH = "#f06a80"

export const EXPRESSIONS = [
  "normal",
  "happy",
  "surprised",
  "confused",
  "thinking",
  "serious",
]

/* ---------- 表情パーツ（全キャラ共通・大きめのキラキラ目） ---------- */

/**
 * 萌え調の瞳。キャラクターごとの瞳色グラデーション、太めの上まつ毛と目尻のハネ、
 * 複数のハイライト、下側の照り返しで描く。ctx = { id, iris: { dark, mid, light } }
 */
const eye = (x, y, e, side, ctx) => {
  const out = side === "l" ? -1 : 1
  const stroke = (d, w = 4) =>
    `<path d="${d}" fill="none" stroke="${EYE}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`
  const lash = (dy = 0) =>
    stroke(
      `M${x - 13} ${y - 6 + dy} Q${x} ${y - 19 + dy} ${x + 13} ${y - 6 + dy}`,
      4.5
    ) + stroke(`M${x + 13 * out} ${y - 6 + dy} l${4 * out} -4`, 3)
  const iris = (rx = 11, ry = 14, px = 0, py = 1, prx = 5.5, pry = 8) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${ctx.id}-iris)" stroke="${EYE}" stroke-width="1.5"/>` +
    `<ellipse cx="${x + px}" cy="${y + py}" rx="${prx}" ry="${pry}" fill="${ctx.iris.dark}"/>` +
    `<ellipse cx="${x}" cy="${y + ry - 6}" rx="${rx - 4}" ry="4" fill="${ctx.iris.light}" opacity="0.85"/>`
  const lights = (dx = 0, dy = 0, k = 1) =>
    `<ellipse cx="${x + 4 + dx}" cy="${y - 5 + dy}" rx="${4.5 * k}" ry="${5.5 * k}" fill="#fff"/>` +
    `<circle cx="${x - 4 + dx}" cy="${y + 6 + dy}" r="${2 * k}" fill="#fff"/>` +
    `<path d="M${x - 5 + dx} ${y - 8 + dy} l1 2.2 2.2 1 -2.2 1 -1 2.2 -1 -2.2 -2.2 -1 2.2 -1z" fill="#fff"/>`
  switch (e) {
    case "happy":
      return (
        stroke(`M${x - 11} ${y + 3} Q${x} ${y - 10} ${x + 11} ${y + 3}`, 4.5) +
        stroke(
          `M${x + 11 * out} ${y + 3} l${4 * out} 1 M${x + 9 * out} ${y - 1} l${4 * out} -2`,
          2.5
        )
      )
    case "surprised":
      return (
        iris(12, 15, 0, 0, 3.2, 4.2) +
        lights(0, -1, 1.1) +
        `<circle cx="${x + 5}" cy="${y + 7}" r="1.6" fill="#fff"/>` +
        lash(-3)
      )
    case "confused": {
      // ぐるぐる目
      const k = out
      return stroke(
        `M${x} ${y} a1.5 1.5 0 1 ${k > 0 ? 1 : 0} 3 0 a4 4 0 1 ${k > 0 ? 1 : 0} -8 0 a6.5 6.5 0 1 ${k > 0 ? 1 : 0} 13 0 a9 9 0 1 ${k > 0 ? 1 : 0} -18 0`,
        2.6
      )
    }
    case "thinking":
      return iris(11, 14, 3, -3, 5, 7) + lights(3, -3, 0.9) + lash()
    case "serious": {
      const cid = `${ctx.id}-lid-${side}`
      return (
        `<clipPath id="${cid}"><rect x="${x - 14}" y="${y - 4}" width="28" height="22"/></clipPath>` +
        `<g clip-path="url(#${cid})">${iris(11, 14, 0, 2)}${lights(0, 4, 0.7)}</g>` +
        stroke(`M${x - 13} ${y - 4} L${x + 13} ${y - 4}`, 4.5) +
        stroke(`M${x + 13 * out} ${y - 4} l${4 * out} -3`, 3)
      )
    }
    default:
      return iris() + lights() + lash()
  }
}

/** 瞳・チークのグラデーション定義（キャラクターごとに id を分ける） */
const defs = (ctx) =>
  `<defs>` +
  `<linearGradient id="${ctx.id}-iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ctx.iris.dark}"/><stop offset="0.5" stop-color="${ctx.iris.mid}"/><stop offset="1" stop-color="${ctx.iris.light}"/></linearGradient>` +
  `<radialGradient id="${ctx.id}-blush"><stop offset="0" stop-color="#ff7d9a" stop-opacity="0.75"/><stop offset="0.6" stop-color="#ff9fb4" stop-opacity="0.45"/><stop offset="1" stop-color="#ffb3c4" stop-opacity="0"/></radialGradient>` +
  `</defs>`

const brows = (l, r, e) => {
  const line = (d) =>
    `<path d="${d}" fill="none" stroke="${EYE}" stroke-width="3" stroke-linecap="round"/>`
  switch (e) {
    case "surprised":
      return (
        line(
          `M${l.x - 7} ${l.y - 20} Q${l.x} ${l.y - 25} ${l.x + 7} ${l.y - 20}`
        ) +
        line(
          `M${r.x - 7} ${r.y - 20} Q${r.x} ${r.y - 25} ${r.x + 7} ${r.y - 20}`
        )
      )
    case "confused":
      return (
        line(`M${l.x - 7} ${l.y - 19} L${l.x + 7} ${l.y - 15}`) +
        line(`M${r.x - 7} ${r.y - 15} L${r.x + 7} ${r.y - 19}`)
      )
    case "thinking":
      return line(
        `M${r.x - 6} ${r.y - 19} Q${r.x} ${r.y - 23} ${r.x + 7} ${r.y - 19}`
      )
    case "serious":
      return (
        line(`M${l.x - 8} ${l.y - 16} L${l.x + 7} ${l.y - 11}`) +
        line(`M${r.x - 7} ${r.y - 11} L${r.x + 8} ${r.y - 16}`)
      )
    default:
      return ""
  }
}

const mouth = (x, y, e) => {
  const st = `stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`
  switch (e) {
    case "happy":
      return `<path d="M${x - 9} ${y - 1} Q${x} ${y + 14} ${x + 9} ${y - 1} Z" fill="${MOUTH}" ${st}/><path d="M${x - 4} ${y + 5} Q${x} ${y + 2} ${x + 4} ${y + 5}" fill="none" stroke="#ffc2cc" stroke-width="2.5" stroke-linecap="round"/>`
    case "surprised":
      return `<ellipse cx="${x}" cy="${y + 4}" rx="5" ry="6.5" fill="${MOUTH}" ${st}/>`
    case "confused":
      return `<path d="M${x - 8} ${y + 3} q4 -4 8 0 q4 4 8 0" fill="none" ${st}/>`
    case "thinking":
      return `<path d="M${x - 2} ${y + 1} q5 2 0 4 q5 2 0 4" fill="none" ${st}/>`
    case "serious":
      return `<path d="M${x - 5} ${y + 3} L${x + 5} ${y + 3}" fill="none" ${st}/>`
    default:
      // ω 口
      return `<path d="M${x - 8} ${y} Q${x - 4} ${y + 6} ${x} ${y} Q${x + 4} ${y + 6} ${x + 8} ${y}" fill="none" ${st}/>`
  }
}

const extras = (e, r) => {
  const st = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"`
  if (e === "confused")
    return `<path d="M${r.x + 38} ${r.y - 34} q-9 13 0 17 q9 -4 0 -17z" fill="#9fd8fb" ${st}/><path d="M${r.x + 46} ${r.y - 54} q6 -6 10 0 q2 6 -5 8 v4" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="${r.x + 51}" cy="${r.y - 37}" r="1.8" fill="${INK}"/>`
  if (e === "thinking")
    return `<circle cx="${r.x + 36}" cy="${r.y - 30}" r="3.5" fill="#fff" ${st}/><circle cx="${r.x + 46}" cy="${r.y - 42}" r="5" fill="#fff" ${st}/><ellipse cx="${r.x + 58}" cy="${r.y - 60}" rx="11" ry="9" fill="#fff" ${st}/><path d="M${r.x + 53} ${r.y - 60} h0.1 M${r.x + 58} ${r.y - 60} h0.1 M${r.x + 63} ${r.y - 60} h0.1" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
  if (e === "surprised")
    return `<path d="M${r.x + 36} ${r.y - 48} v14 M${r.x + 36} ${r.y - 27} v0.1 M${r.x + 46} ${r.y - 44} v12 M${r.x + 46} ${r.y - 25} v0.1" stroke="#ff8a5c" stroke-width="4" stroke-linecap="round"/>`
  if (e === "happy")
    return `<path d="M${r.x + 40} ${r.y - 42} c-6 -8 -16 -2 -10 6 l10 9 10 -9 c6 -8 -4 -14 -10 -6z" fill="#ff8fab" ${st}/><path d="M${-r.x + 200 - 46} ${r.y - 30} l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#ffd45e" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`
  if (e === "serious")
    return `<path d="M${r.x + 36} ${r.y - 40} l8 -4 M${r.x + 38} ${r.y - 30} l10 0 M${r.x + 36} ${r.y - 20} l8 4" stroke="#ff8a5c" stroke-width="3" stroke-linecap="round"/>`
  return ""
}

const blushes = (b, ctx) =>
  b
    .map(
      ({ x, y }) =>
        `<ellipse cx="${x}" cy="${y}" rx="16" ry="10" fill="url(#${ctx.id}-blush)"/><path d="M${x - 6} ${y + 2} l3 -5 M${x - 1} ${y + 2} l3 -5 M${x + 4} ${y + 2} l3 -5" stroke="#ff7f99" stroke-width="1.5" stroke-linecap="round"/>`
    )
    .join("")

const up = (pt) => ({ x: pt.x, y: pt.y - 9 })

/** 瞳を目の中心基準で拡大する（萌え調の大きな瞳） */
const EYE_SCALE = 1.2
const big = ({ x, y }, svgText) =>
  `<g transform="translate(${x} ${y}) scale(${EYE_SCALE}) translate(${-x} ${-y})">${svgText}</g>`

const face = ({ l, r, m, blush }, e, ctx) =>
  blushes(blush, ctx) +
  brows(up(l), up(r), e) +
  big(l, eye(l.x, l.y, e, "l", ctx)) +
  big(r, eye(r.x, r.y, e, "r", ctx)) +
  mouth(m.x, m.y, e) +
  extras(e, up(r))

const ow = (w = SW) =>
  `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`
const o = ow()

/** 小さな手（前足）。左右の位置を指定 */
const paws = (fill, lx = 78, rx = 122, y = 170) =>
  `<ellipse cx="${lx}" cy="${y}" rx="10" ry="8" fill="${fill}" ${o}/><ellipse cx="${rx}" cy="${y}" rx="10" ry="8" fill="${fill}" ${o}/>`

/* ---------- キャラクター本体（200×200・2頭身のちびキャラ） ---------- */

export const species = {
  otter: {
    iris: { dark: "#4a2412", mid: "#c0642a", light: "#ffc27a" },
    sheen: "M66 64 Q84 52 104 54",
    color: { main: "#f2792e", bg: "#ffe1cc" },
    body: `
      <path d="M56 204 Q52 150 100 148 Q148 150 144 204 Z" fill="#c08a60" ${o}/>
      <path d="M76 204 Q76 164 100 162 Q124 164 124 204 Z" fill="#f8e6d0"/>
      <rect x="86" y="160" width="28" height="22" rx="4" fill="#ffd0a8" ${ow(3)}/>
      <path d="M92 167 h16 M92 173 h10" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      ${paws("#c08a60", 84, 116, 172)}`,
    head: `
      <circle cx="48" cy="74" r="12" fill="#c08a60" ${o}/>
      <circle cx="152" cy="74" r="12" fill="#c08a60" ${o}/>
      <circle cx="48" cy="74" r="5.5" fill="#ffc6c6"/>
      <circle cx="152" cy="74" r="5.5" fill="#ffc6c6"/>
      <ellipse cx="100" cy="104" rx="64" ry="56" fill="#c08a60" ${o}/>
      <path d="M44 118 Q48 160 100 160 Q152 160 156 118 Q150 100 128 104 Q114 112 100 112 Q86 112 72 104 Q50 100 44 118 Z" fill="#f8e6d0"/>
      <path d="M94 50 q-2 -14 10 -16 q-8 6 -2 16" fill="#c08a60" ${ow(3)}/>
      <path d="M93 121 q7 -5 14 0 q-2 7 -7 7 q-5 0 -7 -7z" fill="${EYE}"/>
      <circle cx="58" cy="122" r="1.6" fill="${INK}"/><circle cx="54" cy="128" r="1.6" fill="${INK}"/><circle cx="142" cy="122" r="1.6" fill="${INK}"/><circle cx="146" cy="128" r="1.6" fill="${INK}"/>`,
    face: {
      l: { x: 74, y: 108 },
      r: { x: 126, y: 108 },
      m: { x: 100, y: 134 },
      blush: [
        { x: 60, y: 136 },
        { x: 140, y: 136 },
      ],
    },
  },
  munchkin: {
    iris: { dark: "#1e2366", mid: "#5866e0", light: "#a9c8ff" },
    sheen: "M64 70 Q82 58 100 58",
    color: { main: "#5866e0", bg: "#dfe3ff" },
    body: `
      <path d="M58 204 Q54 150 100 148 Q146 150 142 204 Z" fill="#fff" ${o}/>
      <path d="M100 150 L90 176 M100 150 L110 176" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M92 152 L100 162 L108 152 Z" fill="#8c96f0" ${ow(2.5)}/>
      <rect x="84" y="164" width="32" height="24" rx="3" fill="#8c96f0" ${ow(3)}/>
      <path d="M90 182 v-5 M97 182 v-9 M104 182 v-6 M111 182 v-12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      ${paws("#e6dfd6", 82, 118, 176)}`,
    head: `
      <path d="M44 92 Q40 48 56 34 Q76 44 92 58 Z" fill="#e6dfd6" ${o}/>
      <path d="M156 92 Q160 48 144 34 Q124 44 108 58 Z" fill="#e6dfd6" ${o}/>
      <path d="M54 74 Q54 54 60 46 Q72 52 80 60 Z M146 74 Q146 54 140 46 Q128 52 120 60 Z" fill="#ffc4d2"/>
      <ellipse cx="100" cy="106" rx="66" ry="54" fill="#e6dfd6" ${o}/>
      <path d="M90 56 q2 7 1 13 M100 54 v14 M110 56 q-2 7 -1 13" stroke="#c4b6a6" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M36 112 l12 1 M38 124 l11 -2 M164 112 l-12 1 M162 124 l-11 -2" stroke="#c4b6a6" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="132" rx="22" ry="15" fill="#fff"/>
      <path d="M96 124 h8 q0 5 -4 6 q-4 -1 -4 -6z" fill="#ff9fb4"/>`,
    face: {
      l: { x: 72, y: 110 },
      r: { x: 128, y: 110 },
      m: { x: 100, y: 133 },
      blush: [
        { x: 54, y: 132 },
        { x: 146, y: 132 },
      ],
    },
    // 研究員の丸メガネ（細めの金縁）
    overlay: `
      <circle cx="72" cy="110" r="22" fill="#fff" fill-opacity="0.18" stroke="#b08a3e" stroke-width="2.5"/>
      <circle cx="128" cy="110" r="22" fill="#fff" fill-opacity="0.18" stroke="#b08a3e" stroke-width="2.5"/>
      <path d="M94 106 Q100 102 106 106" fill="none" stroke="#b08a3e" stroke-width="2.5" stroke-linecap="round"/>`,
  },
  hamster: {
    iris: { dark: "#4a1e2a", mid: "#b8506a", light: "#ffb0c0" },
    sheen: "M62 70 Q80 60 98 60",
    color: { main: "#e2a40c", bg: "#fff1c7" },
    body: `
      <path d="M50 204 Q46 146 100 144 Q154 146 150 204 Z" fill="#fffaf3" ${o}/>
      <g transform="translate(0 16)"><path d="M90 150 q10 -8 20 0 q4 14 -10 24 q-14 -10 -10 -24z" fill="#3d3a38" ${ow(2.5)}/>
      <path d="M94 154 q6 -4 12 0 q2 9 -6 15 q-8 -6 -6 -15z" fill="#fff6dc"/></g>
      ${paws("#ffd6dc", 84, 116, 186)}`,
    head: `
      <circle cx="54" cy="64" r="15" fill="#d9c8b4" ${o}/>
      <circle cx="146" cy="64" r="15" fill="#d9c8b4" ${o}/>
      <circle cx="54" cy="64" r="8" fill="#ffc4d2"/>
      <circle cx="146" cy="64" r="8" fill="#ffc4d2"/>
      <path d="M32 116 Q30 58 100 54 Q170 58 168 116 Q170 158 100 158 Q30 158 32 116 Z" fill="#fffaf3" ${o}/>
      <path d="M36 100 Q42 60 100 56 Q158 60 164 100 Q140 86 124 90 Q110 94 100 94 Q90 94 76 90 Q60 86 36 100 Z" fill="#cdbcaa"/>
      <path d="M100 58 V88" stroke="#8e7c6a" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="100" cy="124" rx="4.5" ry="3.2" fill="#ff9fb4"/>`,
    face: {
      l: { x: 74, y: 112 },
      r: { x: 126, y: 112 },
      m: { x: 100, y: 131 },
      blush: [
        { x: 52, y: 132 },
        { x: 148, y: 132 },
      ],
    },
  },
  penguin: {
    iris: { dark: "#0d3442", mid: "#2a9cbb", light: "#9fe6f2" },
    sheen: "M64 64 Q84 52 106 52",
    color: { main: "#2a9cbb", bg: "#d4eef5" },
    body: `
      <path d="M56 204 Q50 148 100 146 Q150 148 144 204 Z" fill="#3c4560" ${o}/>
      <path d="M72 204 Q72 162 100 160 Q128 162 128 204 Z" fill="#fff"/>
      <path d="M76 182 Q100 172 124 182" fill="none" stroke="#3c4560" stroke-width="4" stroke-linecap="round"/>
      <path d="M88 150 L100 157 L88 164 Z M112 150 L100 157 L112 164 Z" fill="#5cc3dd" ${ow(2.5)}/>
      <circle cx="100" cy="157" r="3.5" fill="#5cc3dd" ${ow(2.5)}/>
      <path d="M58 160 q-14 8 -12 22 q10 -2 16 -12" fill="#3c4560" ${o}/>
      <path d="M142 160 q14 8 12 22 q-10 -2 -16 -12" fill="#3c4560" ${o}/>`,
    head: `
      <ellipse cx="100" cy="104" rx="64" ry="58" fill="#3c4560" ${o}/>
      <path d="M48 104 Q50 64 100 66 Q150 64 152 104 Q156 152 100 154 Q44 152 48 104 Z" fill="#fff"/>
      <ellipse cx="86" cy="128" rx="8" ry="5" fill="#ffc0c6"/>
      <ellipse cx="114" cy="128" rx="8" ry="5" fill="#ffc0c6"/>
      <path d="M90 121 Q100 115 110 121 Q104 131 100 131 Q96 131 90 121 Z" fill="#3b3434" ${ow(2.5)}/>`,
    face: {
      l: { x: 74, y: 106 },
      r: { x: 126, y: 106 },
      m: { x: 100, y: 140 },
      blush: [
        { x: 60, y: 130 },
        { x: 140, y: 130 },
      ],
    },
  },
}

const svg = (viewBox, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${body.replace(/\s*\n\s*/g, "")}</svg>\n`

/** 背景のキラキラ・ハート */
const sparkles = (color) =>
  `<path d="M200 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#ffd45e" opacity="0.9"/>` +
  `<path d="M36 64 c-4 -6 -12 -1 -7 5 l7 7 7 -7 c5 -6 -3 -11 -7 -5z" fill="${color}" opacity="0.5"/>` +
  `<circle cx="214" cy="80" r="5" fill="${color}" opacity="0.35"/>` +
  `<circle cx="28" cy="32" r="4" fill="#ffd45e" opacity="0.7"/>`

const figure = (s, e) =>
  defs(s) +
  s.body +
  // 頭の下の影（セル塗り風）
  `<ellipse cx="100" cy="152" rx="40" ry="7" fill="#3b2c2c" opacity="0.13"/>` +
  s.head +
  // 毛並みのツヤ
  `<path d="${s.sheen}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="5" stroke-linecap="round"/>` +
  face(s.face, e, s) +
  (s.overlay ?? "")

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

for (const [id, s] of Object.entries(species)) s.id = id

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
        sparkles(s.color.main) +
        `<g clip-path="url(#frame)"><svg x="4" y="8" width="232" height="232" viewBox="0 0 200 200">${figure(s, "happy")}</svg></g>` +
        `<rect x="4" y="4" width="232" height="232" rx="36" fill="none" ${o}/>`,
      names[id]
    )
  )
}

// 4匹の集合イラスト（ハートやキラキラを散らす）
const order = ["otter", "munchkin", "hamster", "penguin"]
const group =
  `<rect width="880" height="300" rx="40" fill="#fff3dc"/>` +
  `<ellipse cx="440" cy="292" rx="400" ry="22" fill="#ffc94a" opacity="0.5"/>` +
  `<g transform="translate(10 0)">${sparkles("#ff8fab")}</g><g transform="translate(640 10)">${sparkles("#5cc3dd")}</g>` +
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
