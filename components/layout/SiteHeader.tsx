import Link from "next/link"
import { css, mq, Style } from "@/components/ui/Style"
import { Logo } from "./Logo"

export const mainNav = [
  { href: "/topics/", label: "トピック一覧" },
  { href: "/categories/", label: "カテゴリ" },
  { href: "/elections/", label: "選挙・特集" },
  { href: "/about/", label: "サイトについて" },
]

const styles = css`
  .SiteHeader {
    background: rgba(255, 247, 234, 0.95);
    backdrop-filter: saturate(1.4) blur(8px);
    border-bottom: 2px solid var(--c-ink);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .SiteHeader_inner {
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--gutter);
    display: flex;
    flex-direction: column;
  }
  .SiteHeader_brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 0 8px;
    text-decoration: none;
  }
  .SiteHeader_tagline {
    font-size: 0.72rem;
    color: var(--c-text-sub);
    letter-spacing: 0.04em;
    display: none;
  }
  .SiteHeader_nav {
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 calc(var(--gutter) * -1);
    padding: 0 var(--gutter) 10px;
  }
  .SiteHeader_nav::-webkit-scrollbar {
    display: none;
  }
  .SiteHeader_list {
    list-style: none;
    display: flex;
    gap: 6px;
    white-space: nowrap;
  }
  .SiteHeader_link {
    display: block;
    padding: 4px 14px;
    font-size: 0.85rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--c-ink);
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    background: var(--c-surface);
  }
  .SiteHeader_link:hover {
    background: var(--c-yellow);
  }
  .SiteHeader_skip {
    position: absolute;
    left: 8px;
    top: 8px;
    transform: translateY(-200%);
    background: var(--c-ink);
    color: #fff;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    z-index: 20;
  }
  .SiteHeader_skip:focus {
    transform: none;
  }
  ${mq.tablet} {
    .SiteHeader_inner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
    .SiteHeader_brand {
      padding: 0;
    }
    .SiteHeader_tagline {
      display: inline;
    }
    .SiteHeader_nav {
      margin: 0;
      padding: 0;
    }
  }
`

export const SiteHeader = () => (
  <header className="SiteHeader">
    <Style id="SiteHeader">{styles}</Style>
    <a className="SiteHeader_skip" href="#main">
      本文へスキップ
    </a>
    <div className="SiteHeader_inner">
      <Link
        href="/"
        className="SiteHeader_brand"
        aria-label="RonTo トップページ"
      >
        <Logo />
        <span className="SiteHeader_tagline">
          政治や社会のこと、ゆるっと話そう。
        </span>
      </Link>
      <nav className="SiteHeader_nav" aria-label="メインメニュー">
        <ul className="SiteHeader_list">
          {mainNav.map((n) => (
            <li key={n.href}>
              <Link className="SiteHeader_link" href={n.href}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
)
