import Link from "next/link"
import { ReactNode } from "react"
import { css, mq, Style } from "./Style"

const styles = css`
  .Container {
    width: 100%;
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--gutter);
  }
  .Container--narrow {
    max-width: calc(var(--container-narrow) + var(--gutter) * 2);
  }
  .PageHeader {
    padding: 36px 0 24px;
  }
  .PageHeader_eyebrow {
    display: inline-block;
    color: var(--c-ink);
    background: var(--c-yellow);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    padding: 2px 12px;
    border-radius: 999px;
    border: 2px solid var(--c-ink);
    transform: rotate(-2deg);
  }
  .PageHeader_title {
    font-size: 1.8rem;
    line-height: 1.4;
    margin-top: 12px;
    letter-spacing: 0.04em;
    font-weight: 900;
  }
  .PageHeader_lead {
    color: var(--c-text-sub);
    margin-top: 12px;
    max-width: 40em;
  }
  ${mq.tablet} {
    .PageHeader {
      padding: 56px 0 32px;
    }
    .PageHeader_title {
      font-size: 2.4rem;
    }
  }
  .SectionHeading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
  }
  .SectionHeading_title {
    font-size: 1.45rem;
    line-height: 1.4;
    font-weight: 900;
    display: inline;
    background: linear-gradient(
      transparent 62%,
      var(--c-yellow) 62%,
      var(--c-yellow) 92%,
      transparent 92%
    );
    padding: 0 4px;
  }
  .SectionHeading_en {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    color: var(--c-accent);
    font-weight: 900;
    margin-bottom: 2px;
  }
  .SectionHeading_more {
    font-size: 0.85rem;
    color: var(--c-ink);
    font-weight: 700;
    white-space: nowrap;
    text-decoration: none;
    border: 2px solid var(--c-ink);
    border-radius: 999px;
    padding: 4px 14px;
    background: var(--c-surface);
    box-shadow: 2px 2px 0 var(--c-ink);
  }
  .SectionHeading_more:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--c-ink);
  }
  .Section {
    padding: 40px 0;
  }
  ${mq.tablet} {
    .Section {
      padding: 56px 0;
    }
  }
`

export const BaseStyles = () => <Style id="primitives">{styles}</Style>

export const Container = ({
  children,
  narrow,
}: {
  children: ReactNode
  narrow?: boolean
}) => (
  <div className={narrow ? "Container Container--narrow" : "Container"}>
    <BaseStyles />
    {children}
  </div>
)

export const PageHeader = ({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string
  title: string
  lead?: ReactNode
  children?: ReactNode
}) => (
  <header className="PageHeader">
    <BaseStyles />
    {eyebrow && <p className="PageHeader_eyebrow">{eyebrow}</p>}
    <h1 className="PageHeader_title">{title}</h1>
    {lead && <p className="PageHeader_lead">{lead}</p>}
    {children}
  </header>
)

export const SectionHeading = ({
  title,
  en,
  id,
  more,
}: {
  title: string
  en?: string
  id?: string
  more?: { href: string; label: string }
}) => (
  <div className="SectionHeading">
    <BaseStyles />
    <div>
      {en && (
        <span className="SectionHeading_en" aria-hidden="true">
          {en}
        </span>
      )}
      <h2 className="SectionHeading_title" id={id}>
        {title}
      </h2>
    </div>
    {more && (
      <Link className="SectionHeading_more" href={more.href}>
        {more.label} →
      </Link>
    )}
  </div>
)

export const Section = ({
  children,
  labelledBy,
  style,
}: {
  children: ReactNode
  labelledBy?: string
  style?: React.CSSProperties
}) => (
  <section className="Section" aria-labelledby={labelledBy} style={style}>
    <BaseStyles />
    {children}
  </section>
)

/** 構造化データ (JSON-LD) */
export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    // JSON.stringify の結果に含まれる "<" をエスケープして script 終端の混入を防ぐ
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)
