import Link from "next/link"
import { css, mq, Style } from "@/components/ui/Style"
import { categories } from "@/lib/content"
import { site } from "@/lib/site"
import { Logo } from "./Logo"

const styles = css`
  .SiteFooter {
    margin-top: auto;
    background: var(--c-navy);
    color: #dfe4ee;
    padding: 48px 0 32px;
    font-size: 0.875rem;
  }
  .SiteFooter_inner {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--gutter);
    display: grid;
    gap: 32px;
  }
  .SiteFooter .Logo {
    color: #fff;
  }
  .SiteFooter_concept {
    margin-top: 12px;
    color: #b9c2d4;
    font-size: 0.8rem;
  }
  .SiteFooter_heading {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    color: #8f9bb3;
    margin-bottom: 8px;
  }
  .SiteFooter_list {
    list-style: none;
    display: grid;
    gap: 6px;
  }
  .SiteFooter_link {
    text-decoration: none;
  }
  .SiteFooter_link:hover {
    text-decoration: underline;
    color: #fff;
  }
  .SiteFooter_note {
    grid-column: 1 / -1;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 20px;
    color: #8f9bb3;
    font-size: 0.75rem;
    display: grid;
    gap: 6px;
  }
  ${mq.tablet} {
    .SiteFooter_inner {
      grid-template-columns: 2fr 1fr 1fr;
    }
  }
`

const siteLinks = [
  { href: "/about/", label: "サイトについて" },
  { href: "/about/#editorial-policy", label: "編集方針" },
  { href: "/sources/", label: "情報源について" },
  { href: site.publisher.url, label: "運営会社", external: true },
  { href: "/privacy/", label: "プライバシーポリシー" },
]

export const SiteFooter = () => (
  <footer className="SiteFooter">
    <Style id="SiteFooter">{styles}</Style>
    <div className="SiteFooter_inner">
      <div>
        <Logo />
        <p className="SiteFooter_concept">{site.concept}</p>
      </div>
      <nav aria-labelledby="footer-categories">
        <h2 className="SiteFooter_heading" id="footer-categories">
          カテゴリ
        </h2>
        <ul className="SiteFooter_list">
          {categories.map((c) => (
            <li key={c.id}>
              <Link className="SiteFooter_link" href={`/categories/${c.id}/`}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-labelledby="footer-site">
        <h2 className="SiteFooter_heading" id="footer-site">
          RonToについて
        </h2>
        <ul className="SiteFooter_list">
          {siteLinks.map((l) => (
            <li key={l.href}>
              {l.external ? (
                <a
                  className="SiteFooter_link"
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {l.label}（外部サイト）
                </a>
              ) : (
                <Link className="SiteFooter_link" href={l.href}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="SiteFooter_note">
        <p>
          RonToの議論に登場する人物は、AIが特定の視点を演じる架空の役割です。実在の専門家・政治家・有権者の発言ではありません。
        </p>
        <p>&copy; {site.publisher.name}</p>
      </div>
    </div>
  </footer>
)
