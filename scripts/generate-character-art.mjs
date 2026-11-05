/* global process, console */
/**
 * キャラクター画像（SVG）の書き出しスクリプト。
 *
 *   node scripts/generate-character-art.mjs
 *
 * 4匹はそれぞれ個別に描いた1枚絵（全身）。表情差分は作らない。
 * プロフィール画像・アイコン（同じ絵の頭部を切り出し）・集合イラストを
 * public/images/characters/ 配下に書き出す。生成物はリポジトリにコミットする。
 */
import fs from "node:fs"
import path from "node:path"

const OUT = path.join(process.cwd(), "public", "images", "characters")

/** 縁取りつきの太い線（腕・しっぽなど）。線色 → 塗り色の2重線で描く */
const limb = (d, fill, line, w) =>
  `<path d="${d}" fill="none" stroke="${line}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`

/* ---------- コツメカワウソ：後ろ足で立ち、スマホを両手で持っている ---------- */
const otter = (() => {
  const fur = "#9b6a45"
  const dark = "#7a5034"
  const cream = "#f1dcc2"
  const line = "#5a3a26"
  const st = `stroke="${line}" stroke-width="3" stroke-linejoin="round"`
  return {
    bg: "#ffe1cc",
    head: { x: 120, y: 80, r: 50 },
    art:
      // しっぽ
      limb("M150 204 C186 206 200 186 194 164", fur, line, 15) +
      // 足
      `<ellipse cx="102" cy="214" rx="15" ry="7" fill="${dark}" ${st}/>` +
      `<ellipse cx="138" cy="214" rx="15" ry="7" fill="${dark}" ${st}/>` +
      // 胴体
      `<path d="M88 212 C78 172 84 126 120 112 C156 126 162 172 152 212 Z" fill="${fur}" ${st}/>` +
      `<path d="M102 210 C96 178 102 140 120 132 C138 140 144 178 138 210 Z" fill="${cream}"/>` +
      // スマホと腕
      `<rect x="109" y="124" width="22" height="32" rx="4" fill="#3d4a66" ${st}/>` +
      `<rect x="113" y="129" width="14" height="21" rx="2" fill="#a9d7ff"/>` +
      limb("M94 126 C90 140 98 150 108 148", fur, line, 11) +
      limb("M146 126 C150 140 142 150 132 148", fur, line, 11) +
      `<ellipse cx="109" cy="146" rx="6" ry="5" fill="${dark}" ${st}/>` +
      `<ellipse cx="131" cy="146" rx="6" ry="5" fill="${dark}" ${st}/>` +
      // 耳
      `<circle cx="87" cy="64" r="8" fill="${dark}" ${st}/>` +
      `<circle cx="153" cy="64" r="8" fill="${dark}" ${st}/>` +
      // 頭
      `<path d="M82 84 C82 58 100 44 120 44 C140 44 158 58 158 84 C158 106 142 120 120 120 C98 120 82 106 82 84 Z" fill="${fur}" ${st}/>` +
      `<path d="M90 96 C92 84 106 82 120 86 C134 82 148 84 150 96 C152 110 138 118 120 118 C102 118 88 110 90 96 Z" fill="${cream}"/>` +
      `<path d="M104 50 Q120 44 136 50" fill="none" stroke="#b88560" stroke-width="3" stroke-linecap="round" opacity="0.7"/>` +
      // 目
      `<circle cx="103" cy="82" r="5.5" fill="#24160f"/><circle cx="101.4" cy="80.2" r="1.8" fill="#fff"/>` +
      `<circle cx="137" cy="82" r="5.5" fill="#24160f"/><circle cx="135.4" cy="80.2" r="1.8" fill="#fff"/>` +
      // 鼻・口・ひげ・ほっぺ
      `<path d="M112 93 Q120 88 128 93 Q127 100 120 101 Q113 100 112 93 Z" fill="#3a2418"/>` +
      `<path d="M120 101 V105 M113 106 Q117 110 120 105 Q123 110 127 106" fill="none" stroke="${line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="108" cy="102" r="1.2" fill="${line}"/><circle cx="104" cy="105" r="1.2" fill="${line}"/>` +
      `<circle cx="132" cy="102" r="1.2" fill="${line}"/><circle cx="136" cy="105" r="1.2" fill="${line}"/>` +
      `<ellipse cx="96" cy="99" rx="6" ry="3.5" fill="#f2a28f" opacity="0.55"/>` +
      `<ellipse cx="144" cy="99" rx="6" ry="3.5" fill="#f2a28f" opacity="0.55"/>`,
  }
})()

/* ---------- マンチカン：短い足で座り、しっぽを前に回している。丸メガネ ---------- */
const munchkin = (() => {
  const fur = "#bdb5aa"
  const stripe = "#8f867b"
  const white = "#f8f5f0"
  const line = "#4e4740"
  const st = `stroke="${line}" stroke-width="3" stroke-linejoin="round"`
  const rim = "#9c7a3a"
  return {
    bg: "#dfe3ff",
    head: { x: 120, y: 92, r: 50 },
    art:
      // 腰まわり
      `<ellipse cx="90" cy="202" rx="20" ry="14" fill="${fur}" ${st}/>` +
      `<ellipse cx="150" cy="202" rx="20" ry="14" fill="${fur}" ${st}/>` +
      // 胴体
      `<path d="M84 212 C78 178 88 142 120 134 C152 142 162 178 156 212 Z" fill="${fur}" ${st}/>` +
      `<path d="M104 204 C100 174 106 150 120 146 C134 150 140 174 136 204 Z" fill="${white}"/>` +
      `<path d="M88 168 q8 -4 12 2 M86 184 q8 -4 12 2 M152 168 q-8 -4 -12 2 M154 184 q-8 -4 -12 2" fill="none" stroke="${stripe}" stroke-width="3.5" stroke-linecap="round"/>` +
      // 短い前足
      `<rect x="101" y="186" width="16" height="26" rx="8" fill="${fur}" ${st}/>` +
      `<rect x="123" y="186" width="16" height="26" rx="8" fill="${fur}" ${st}/>` +
      `<ellipse cx="109" cy="210" rx="8" ry="4.5" fill="${white}" ${st}/>` +
      `<ellipse cx="131" cy="210" rx="8" ry="4.5" fill="${white}" ${st}/>` +
      // しっぽ（前に回す）
      limb("M156 206 C186 210 196 196 186 184", fur, line, 12) +
      `<path d="M178 202 l4 -8 M186 196 l6 -4" stroke="${stripe}" stroke-width="3" stroke-linecap="round"/>` +
      // 耳
      `<path d="M80 78 L84 38 Q86 33 91 36 L113 58 Z" fill="${fur}" ${st}/>` +
      `<path d="M160 78 L156 38 Q154 33 149 36 L127 58 Z" fill="${fur}" ${st}/>` +
      `<path d="M87 66 L89 45 L104 58 Z M153 66 L151 45 L136 58 Z" fill="#f2b8c2"/>` +
      // 頭
      `<path d="M76 96 C76 68 96 54 120 54 C144 54 164 68 164 96 C164 120 144 134 120 134 C96 134 76 120 76 96 Z" fill="${fur}" ${st}/>` +
      `<path d="M112 60 l2 12 M120 58 v15 M128 60 l-2 12" stroke="${stripe}" stroke-width="3.5" stroke-linecap="round"/>` +
      `<path d="M78 100 l11 2 M80 111 l10 -1 M162 100 l-11 2 M160 111 l-10 -1" stroke="${stripe}" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="120" cy="114" rx="18" ry="12" fill="${white}"/>` +
      // 目（縦長の瞳孔）
      `<ellipse cx="103" cy="96" rx="6.5" ry="7" fill="#b9b04a"/><ellipse cx="103" cy="96" rx="2.2" ry="5.5" fill="#2a2420"/><circle cx="101" cy="93.5" r="1.6" fill="#fff"/>` +
      `<ellipse cx="137" cy="96" rx="6.5" ry="7" fill="#b9b04a"/><ellipse cx="137" cy="96" rx="2.2" ry="5.5" fill="#2a2420"/><circle cx="135" cy="93.5" r="1.6" fill="#fff"/>` +
      // メガネ
      `<circle cx="103" cy="96" r="11" fill="#fff" fill-opacity="0.15" stroke="${rim}" stroke-width="2.2"/>` +
      `<circle cx="137" cy="96" r="11" fill="#fff" fill-opacity="0.15" stroke="${rim}" stroke-width="2.2"/>` +
      `<path d="M114 95 Q120 91 126 95 M92 94 L80 91 M148 94 L160 91" fill="none" stroke="${rim}" stroke-width="2.2" stroke-linecap="round"/>` +
      // 鼻・口・ひげ
      `<path d="M116 108 h8 l-4 4.5 z" fill="#e8949f"/>` +
      `<path d="M120 112.5 V115 M114 117 Q117 119.5 120 115 Q123 119.5 126 117" fill="none" stroke="${line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M104 114 L84 112 M104 118 L86 121 M136 114 L156 112 M136 118 L154 121" stroke="${line}" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>`,
  }
})()

/* ---------- ジャンガリアンハムスター：立ってひまわりの種を抱えている ---------- */
const hamster = (() => {
  const grey = "#aaa39a"
  const white = "#fcf9f4"
  const line = "#5a5049"
  const pink = "#f3b4bd"
  const st = `stroke="${line}" stroke-width="3" stroke-linejoin="round"`
  return {
    bg: "#fff1c7",
    head: { x: 120, y: 118, r: 52 },
    art:
      // 足
      `<ellipse cx="104" cy="216" rx="10" ry="5" fill="${pink}" ${st}/>` +
      `<ellipse cx="136" cy="216" rx="10" ry="5" fill="${pink}" ${st}/>` +
      // 耳
      `<circle cx="91" cy="80" r="11" fill="${grey}" ${st}/><circle cx="91" cy="81" r="5.5" fill="${pink}"/>` +
      `<circle cx="149" cy="80" r="11" fill="${grey}" ${st}/><circle cx="149" cy="81" r="5.5" fill="${pink}"/>` +
      // 体（頭と胴がひとつながり）
      `<path d="M74 162 C72 106 94 74 120 74 C146 74 168 106 166 162 C166 202 146 218 120 218 C94 218 74 202 74 162 Z" fill="${white}" ${st}/>` +
      `<path d="M77 138 C80 98 96 76 120 76 C144 76 160 98 163 138 C154 116 140 106 120 106 C100 106 86 116 77 138 Z" fill="${grey}"/>` +
      `<path d="M120 77 C119 86 119 95 120 104" stroke="#5e5750" stroke-width="5" stroke-linecap="round" fill="none"/>` +
      // 目
      `<circle cx="104" cy="122" r="5.5" fill="#1d1715"/><circle cx="102.4" cy="120.2" r="1.9" fill="#fff"/>` +
      `<circle cx="136" cy="122" r="5.5" fill="#1d1715"/><circle cx="134.4" cy="120.2" r="1.9" fill="#fff"/>` +
      // 鼻・口・ひげ・ほっぺ
      `<ellipse cx="120" cy="132" rx="3.2" ry="2.3" fill="#e88a99"/>` +
      `<path d="M120 134 V137 M115.5 139 Q118 141 120 137 Q122 141 124.5 139" fill="none" stroke="${line}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M108 134 L92 131 M108 137 L93 140 M132 134 L148 131 M132 137 L147 140" stroke="${line}" stroke-width="1.1" stroke-linecap="round" opacity="0.55"/>` +
      `<ellipse cx="95" cy="138" rx="8" ry="5" fill="#f6a9b4" opacity="0.5"/>` +
      `<ellipse cx="145" cy="138" rx="8" ry="5" fill="#f6a9b4" opacity="0.5"/>` +
      // ひまわりの種と前足
      `<path d="M120 148 C129 152 131 167 120 178 C109 167 111 152 120 148 Z" fill="#3b3633" ${st}/>` +
      `<path d="M120 152 V174 M115 156 Q114 164 116 171 M125 156 Q126 164 124 171" fill="none" stroke="#e9e2d2" stroke-width="1.6" stroke-linecap="round"/>` +
      `<ellipse cx="110" cy="166" rx="6.5" ry="5.5" fill="${pink}" ${st}/>` +
      `<ellipse cx="130" cy="166" rx="6.5" ry="5.5" fill="${pink}" ${st}/>`,
  }
})()

/* ---------- フンボルトペンギン：まっすぐ立っている ---------- */
const penguin = (() => {
  const black = "#2c3038"
  const white = "#fbfbfb"
  const line = "#1c1f25"
  const pink = "#f2a7a9"
  const st = `stroke="${line}" stroke-width="3" stroke-linejoin="round"`
  return {
    bg: "#d4eef5",
    head: { x: 120, y: 80, r: 50 },
    art:
      // 足
      `<path d="M98 210 q-12 6 -4 9 h20 q6 -2 -2 -9 Z" fill="#3b3b3f" ${st}/>` +
      `<path d="M142 210 q12 6 4 9 h-20 q-6 -2 2 -9 Z" fill="#3b3b3f" ${st}/>` +
      // 体（頭からひとつながり）
      `<path d="M120 40 C141 40 153 56 153 76 C153 92 149 100 155 120 C164 152 162 190 150 212 L90 212 C78 190 76 152 85 120 C91 100 87 92 87 76 C87 56 99 40 120 40 Z" fill="${black}" ${st}/>` +
      `<path d="M120 116 C139 116 149 142 149 170 C149 196 139 210 120 210 C101 210 91 196 91 170 C91 142 101 116 120 116 Z" fill="${white}"/>` +
      // フリッパー
      `<path d="M90 118 C76 138 72 168 80 184 C88 172 94 148 96 126 Z" fill="${black}" ${st}/>` +
      `<path d="M150 118 C164 138 168 168 160 184 C152 172 146 148 144 126 Z" fill="${black}" ${st}/>` +
      // 胸の黒い帯と斑点
      `<path d="M93 156 C96 130 144 130 147 156" fill="none" stroke="${black}" stroke-width="6" stroke-linecap="round"/>` +
      `<circle cx="110" cy="176" r="2" fill="${black}"/><circle cx="131" cy="184" r="1.8" fill="${black}"/><circle cx="124" cy="168" r="1.5" fill="${black}"/>` +
      // 頭の白い帯（目の上から顔のまわりを通ってのどへ）
      `<path d="M101 60 C89 70 90 96 104 108 C112 114 128 114 136 108 C150 96 151 70 139 60" fill="none" stroke="${white}" stroke-width="5.5" stroke-linecap="round"/>` +
      // くちばしの付け根のピンクの皮膚
      `<ellipse cx="108" cy="86" rx="8" ry="5.5" fill="${pink}"/>` +
      `<ellipse cx="132" cy="86" rx="8" ry="5.5" fill="${pink}"/>` +
      // 目
      `<circle cx="107" cy="76" r="5" fill="#140f0f" stroke="#7d5a4a" stroke-width="1.5"/><circle cx="105.6" cy="74.4" r="1.7" fill="#fff"/>` +
      `<circle cx="133" cy="76" r="5" fill="#140f0f" stroke="#7d5a4a" stroke-width="1.5"/><circle cx="131.6" cy="74.4" r="1.7" fill="#fff"/>` +
      // くちばし
      `<path d="M111 85 Q120 80 129 85 L122 101 Q120 103 118 101 Z" fill="#2a2a2e" stroke="${line}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M115 93 L125 93" stroke="#cfcfcf" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M106 50 Q120 44 134 50" fill="none" stroke="#565c69" stroke-width="3" stroke-linecap="round"/>`,
  }
})()

const characters = { otter, munchkin, hamster, penguin }

const names = {
  otter: "コツメカワウソ",
  munchkin: "マンチカン",
  hamster: "ジャンガリアンハムスター",
  penguin: "フンボルトペンギン",
}

const svg = (viewBox, body, label) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${label}">${body}</svg>\n`

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

// 以前の表情差分（パーツ差し替え）画像を削除する
for (const id of Object.keys(characters))
  for (const f of fs.existsSync(path.join(OUT, id))
    ? fs.readdirSync(path.join(OUT, id))
    : [])
    if (!["profile.svg", "icon.svg"].includes(f))
      fs.rmSync(path.join(OUT, id, f))

for (const [id, c] of Object.entries(characters)) {
  // プロフィール画像（全身）
  write(
    path.join(OUT, id, "profile.svg"),
    svg(
      "0 0 240 240",
      `<rect x="2" y="2" width="236" height="236" rx="36" fill="${c.bg}"/>` +
        `<circle cx="120" cy="124" r="92" fill="#fff" opacity="0.45"/>` +
        `<ellipse cx="120" cy="218" rx="70" ry="9" fill="#2b2a33" opacity="0.1"/>` +
        c.art,
      names[id]
    )
  )
  // アイコン（同じ絵の頭部を切り出し）
  const { x, y, r } = c.head
  write(
    path.join(OUT, id, "icon.svg"),
    svg(
      `${x - r} ${y - r} ${r * 2} ${r * 2}`,
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.bg}"/>` + c.art,
      names[id]
    )
  )
}

// 4匹の集合イラスト
const group =
  `<rect width="880" height="300" rx="40" fill="#fff3dc"/>` +
  `<ellipse cx="440" cy="272" rx="400" ry="18" fill="#ffc94a" opacity="0.45"/>` +
  Object.values(characters)
    .map(
      (c, i) =>
        `<circle cx="${100 + i * 227}" cy="150" r="100" fill="${c.bg}"/>` +
        `<g transform="translate(${i * 227 - 20} 50)">${c.art}</g>`
    )
    .join("")
write(
  path.join(OUT, "group.svg"),
  svg("0 0 880 300", group, "RonToの4匹のキャラクター")
)

console.log(`wrote character art to ${path.relative(process.cwd(), OUT)}`)
