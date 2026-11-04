import Link from "next/link"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import { Prose } from "@/components/ui/Prose"
import { pageMetadata } from "@/lib/seo"

const description =
  "RonToが記事で参照する情報源の種類と優先順位、統計・制度の基準日の扱い、記事の更新方針について説明します。"

export const metadata = pageMetadata({
  title: "情報源について",
  description,
  path: "/sources/",
})

const SourcesPage = () => (
  <Container narrow>
    <Breadcrumbs items={[{ name: "情報源について", href: "/sources/" }]} />
    <PageHeader eyebrow="SOURCES" title="情報源について" lead={description} />
    <Prose>
      <h2>参照する情報源の優先順位</h2>
      <ol>
        <li>
          <strong>一次情報</strong>
          ：政府・省庁・自治体・国会（法令、白書、統計、審議会資料、会議録など）
        </li>
        <li>
          <strong>公的機関・研究機関の資料</strong>
          ：日本銀行、独立行政法人、大学・シンクタンクの調査・研究
        </li>
        <li>
          <strong>報道機関の記事</strong>
          ：一次情報だけでは分からない経緯や最新の動きを補うために参照
        </li>
      </ol>
      <p>
        政党・候補者の主張を紹介する場合は、公式サイト・選挙公報・公約集など本人が公表した資料を出典とします。
      </p>

      <h2>出典の示し方</h2>
      <ul>
        <li>
          本文中の [1]
          などの番号は、記事末尾「参考情報・出典」の番号に対応しています。
        </li>
        <li>
          出典ごとに、資料名・発行元・公表日・編集部の閲覧日を記載します。
        </li>
        <li>
          統計や制度には、基準日（〇年〇月時点）や対象期間（〇年度）を付けます。
        </li>
      </ul>

      <h2>AIの議論と事実の区別</h2>
      <p>
        記事内の話し合いは、AIが架空の役割を演じて行う考察です。話し合いの中で触れる統計や制度は出典にもとづいていますが、意見や評価の部分はAIによる議論であり、実在の専門家・政党・政治家の主張ではありません。
      </p>

      <h2>更新と訂正</h2>
      <p>
        制度改正や新しい統計の公表があった場合は記事を更新し、記事上部に更新日を表示します。誤りが判明した場合は速やかに訂正します。
      </p>
      <p className="Prose_small">
        編集方針の全体は
        <Link href="/about/#editorial-policy">サイトについて</Link>
        をご覧ください。
      </p>
    </Prose>
  </Container>
)

export default SourcesPage
