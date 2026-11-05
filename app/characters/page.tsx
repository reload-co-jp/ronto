import {
  CharacterGrid,
  CharacterNotice,
} from "@/components/character/CharacterCard"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { Container, PageHeader } from "@/components/ui/primitives"
import { css, mq, Style } from "@/components/ui/Style"
import { characters } from "@/lib/characters"
import { pageMetadata } from "@/lib/seo"

const description =
  "RonToの雑談に登場する4匹のキャラクター。素朴な疑問のカワウソ、数字と論理のマンチカン、暮らしの視点のハムスター、歴史と国際関係のペンギンを紹介します。"

export const metadata = pageMetadata({
  title: "キャラクター紹介",
  description,
  path: "/characters/",
})

const styles = css`
  .CharactersPage {
    padding-bottom: 64px;
  }
  .CharactersPage_group {
    margin: 0 0 32px;
    border: 2px solid var(--c-ink);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    background: #fff3dc;
  }
  .CharactersPage_group img {
    display: block;
    width: 100%;
    height: auto;
  }
  .CharactersPage_group figcaption {
    border-top: 2px solid var(--c-ink);
    background: var(--c-surface);
    padding: 10px 16px;
    font-size: 0.82rem;
    color: var(--c-text-sub);
    line-height: 1.7;
  }
  ${mq.tablet} {
    .CharactersPage_group figcaption {
      padding: 12px 20px;
    }
  }
`

const CharactersPage = () => (
  <Container>
    <Style id="CharactersPage">{styles}</Style>
    <Breadcrumbs items={[{ name: "キャラクター", href: "/characters/" }]} />
    <PageHeader
      eyebrow="CHARACTERS"
      title="キャラクター紹介"
      lead="RonToの雑談は、性格も得意分野もちがう4匹のキャラクターが進めます。答えを決めるためではなく、いろんな角度から考えるための仲間たちです。"
    />
    <div className="CharactersPage">
      <figure className="CharactersPage_group">
        <img
          src="/images/characters/group.svg"
          alt="コツメカワウソ、マンチカン、ジャンガリアンハムスター、フンボルトペンギンの4匹が並んだイラスト"
          width={880}
          height={300}
        />
        <figcaption>
          左から{characters.map((c) => c.name).join("・")}。
          疑問を投げかける聞き役と、それぞれの視点を持つ3匹で話を進めます。
        </figcaption>
      </figure>
      <CharacterGrid characters={characters} />
      <CharacterNotice />
    </div>
  </Container>
)

export default CharactersPage
