import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import { Prose } from "@/components/ui/Prose"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

const description = `${site.name}における利用者情報の取り扱いについて定めたプライバシーポリシーです。`

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description,
  path: "/privacy/",
})

const PrivacyPage = () => (
  <Container narrow>
    <Breadcrumbs
      items={[{ name: "プライバシーポリシー", href: "/privacy/" }]}
    />
    <PageHeader
      eyebrow="PRIVACY POLICY"
      title="プライバシーポリシー"
      lead={description}
    />
    <Prose>
      <p>
        {site.publisher.name}（以下「当社」）は、当社が運営する{site.name}（
        {site.url}
        、以下「本サイト」）における利用者の情報を、以下の方針にもとづき適切に取り扱います。
      </p>
      <h2>1. 取得する情報</h2>
      <p>
        本サイトは、記事の閲覧にあたって会員登録や氏名・メールアドレスなどの入力を求めていません。本サイトの配信にあたり、サーバーやホスティング事業者においてアクセスログ（IPアドレス、ブラウザの種類、閲覧日時など）が記録される場合があります。
      </p>
      <h2>2. 利用目的</h2>
      <ul>
        <li>本サイトの安定した運営・不正アクセスの防止</li>
        <li>本サイトの改善のための統計的な分析</li>
      </ul>
      <h2>3. 外部サービスの利用</h2>
      <p>
        本サイトでは、文字の表示にGoogle LLCが提供するGoogle
        Fontsを利用しています。フォントの読み込みの際に、利用者のIPアドレスなどがGoogleに送信される場合があります。詳しくは
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Googleのプライバシーポリシー
        </a>
        をご覧ください。
      </p>
      <h2>4. アクセス解析ツール等</h2>
      <p>
        本サイトでアクセス解析ツールや広告配信サービスなど、Cookie等を利用する外部サービスを導入する場合は、その名称と取得される情報、オプトアウトの方法を本ポリシーに掲載します。
      </p>
      <h2>5. 第三者提供</h2>
      <p>
        法令にもとづく場合を除き、取得した情報を本人の同意なく第三者に提供することはありません。
      </p>
      <h2>6. 外部サイトへのリンク</h2>
      <p>
        本サイトの出典などからリンクしている外部サイトにおける情報の取り扱いについては、各サイトのポリシーをご確認ください。
      </p>
      <h2>7. 改定</h2>
      <p>
        本ポリシーの内容は、必要に応じて予告なく改定することがあります。改定後の内容は本ページに掲載した時点から効力を生じます。
      </p>
      <h2>8. お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、
        <a href={site.publisher.url} target="_blank" rel="noopener noreferrer">
          運営会社のウェブサイト
        </a>
        よりご連絡ください。
      </p>
    </Prose>
  </Container>
)

export default PrivacyPage
