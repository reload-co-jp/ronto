import Link from "next/link"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import { Prose } from "@/components/ui/Prose"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

const description =
  "RonToは、政治や社会問題にあまり興味がない人でも、日常の素朴な疑問から社会の仕組みを考えられる読み物メディアです。コンセプト・運営者・編集方針を紹介します。"

export const metadata = pageMetadata({
  title: "サイトについて",
  description,
  path: "/about/",
})

const AboutPage = () => (
  <Container narrow>
    <Breadcrumbs items={[{ name: "サイトについて", href: "/about/" }]} />
    <PageHeader eyebrow="ABOUT" title="RonToについて" lead={site.concept} />
    <Prose>
      <p>
        RonTo（ロント）は、政治・社会・経済をテーマにした読み物メディアです。「消費税を下げると誰が得するの？」「なぜ円安だと困るの？」といった、ニュースを見て浮かぶけれど人には聞きにくい疑問を、1記事につき1つずつ取り上げます。
      </p>
      <p>
        記事の中心は、生活者・経済・社会保障・行政・地方など、異なる立場や価値観をもつ複数のAIによる話し合いです。ただし、AI同士の雑談で終わらせることはしません。背景となる制度や統計、論点、メリットとデメリット、誰にどのような影響があるかを整理し、読者が自分で考え、判断するための材料を届けることを目指しています。
      </p>

      <h2 id="how-to-read">記事の読み方</h2>
      <ol>
        <li>
          「基本情報・背景」「そもそも何が問題なのか」で、テーマの前提をおさえます。
        </li>
        <li>
          「みんなで話してみた」で、立場の違うAIたちの話し合いを読みます。
        </li>
        <li>
          「議論のポイント整理」以降で、論点・賛否の根拠・影響を確認します。
        </li>
        <li>
          「さらに考えたいこと」を手がかりに、自分ならどう考えるかを想像してみてください。
        </li>
      </ol>

      <h2 id="ai-participants">AIの登場人物について</h2>
      <p>
        記事に登場する「生活者の視点」「経済の視点」などの人物は、AIが特定の視点を演じる
        <strong>架空の役割</strong>
        です。実在する専門家・政治家・政党・有権者の発言ではありません。テーマに応じて登場する役割は変わります。また、AIの発言内容は編集部が確認し、事実に関わる部分には出典を付けています。
      </p>

      <h2 id="editorial-policy">編集方針</h2>
      <ul>
        <li>
          統計や制度の説明には出典を明記し、政府・省庁・自治体・国会などの一次情報を優先します。必要に応じて報道機関や研究機関の資料を参照します。
        </li>
        <li>
          事実と意見を区別して書きます。記事末尾では「現時点で分かっている事実」と「まだ結論が出ていない点」を分けて整理します。
        </li>
        <li>AIによる分析・議論と、実際の政治家・政党の主張を区別します。</li>
        <li>
          特定の立場を正解として提示しません。特定の政党・候補者への投票を呼びかけることもありません。
        </li>
        <li>
          賛成と反対を機械的に同じ分量で扱うのではなく、根拠の強さや実際の論点に応じて記述します。
        </li>
        <li>
          根拠が不十分な情報は断定しません。制度や統計には基準日・対象期間を付けます。
        </li>
        <li>
          制度改正や新しい統計の公表などで情報が古くなった場合は記事を更新し、更新日を表示します。
        </li>
      </ul>
      <p>
        参照する情報源の考え方については
        <Link href="/sources/">情報源について</Link>をご覧ください。
      </p>

      <h2 id="operator">運営者</h2>
      <div className="Prose_box">
        <p>
          サイト名：{site.name}
          <br />
          URL：{site.url}
          <br />
          運営：
          <a
            href={site.publisher.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {site.publisher.name}
          </a>
        </p>
      </div>
    </Prose>
  </Container>
)

export default AboutPage
