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
    background: rgba(250, 248, 244, 0.94);
    backdrop-filter: saturate(1.4) blur(8px);
    border-bottom: 1px solid var(--c-border);
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
    padding: 14px 0 6px;
    text-decoration: none;
  }
  .SiteHeader_tagline {
    font-size: 0.7rem;
    color: var(--c-text-sub);
    letter-spacing: 0.06em;
    display: none;
  }
  .SiteHeader_nav {
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 calc(var(--gutter) * -1);
    padding: 0 var(--gutter);
  }
  .SiteHeader_nav::-webkit-scrollbar {
    display: none;
  }
  .SiteHeader_list {
    list-style: none;
    display: flex;
    gap: 4px;
    white-space: nowrap;
  }
  .SiteHeader_link {
    display: block;
    padding: 8px 10px 10px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--c-text);
    border-bottom: 2px solid transparent;
  }
  .SiteHeader_link:hover {
    color: var(--c-accent);
    border-bottom-color: var(--c-accent);
  }
  .SiteHeader_skip {
    position: absolute;
    left: 8px;
    top: 8px;
    transform: translateY(-200%);
    background: var(--c-navy);
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
      height: 68px;
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
    .SiteHeader_link {
      padding: 22px 12px;
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
          政治・社会を、いろんな視点から。
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
