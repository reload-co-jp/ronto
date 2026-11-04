import Link from "next/link"
import { Container, PageHeader } from "@/components/ui/primitives"
import { Prose } from "@/components/ui/Prose"

export const metadata = {
  title: "ページが見つかりません",
  robots: { index: false },
}

const NotFound = () => (
  <Container narrow>
    <PageHeader
      eyebrow="404 NOT FOUND"
      title="お探しのページが見つかりません"
    />
    <Prose>
      <p>URLが間違っているか、記事が移動・非公開になった可能性があります。</p>
      <ul>
        <li>
          <Link href="/">トップページへ戻る</Link>
        </li>
        <li>
          <Link href="/topics/">トピック一覧から探す</Link>
        </li>
        <li>
          <Link href="/categories/">カテゴリから探す</Link>
        </li>
      </ul>
    </Prose>
  </Container>
)

export default NotFound
