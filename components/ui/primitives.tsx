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
    padding: 40px 0 24px;
  }
  .PageHeader_eyebrow {
    color: var(--c-accent);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.12em;
  }
  .PageHeader_title {
    font-size: 1.75rem;
    line-height: 1.4;
    margin-top: 4px;
    letter-spacing: 0.04em;
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
      font-size: 2.25rem;
    }
  }
  .SectionHeading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
  }
  .SectionHeading_title {
    font-size: 1.35rem;
    line-height: 1.4;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .SectionHeading_title::before {
    content: "";
    width: 6px;
    height: 1.1em;
    border-radius: 3px;
    background: var(--c-accent);
    flex: none;
  }
  .SectionHeading_en {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    color: var(--c-text-sub);
    font-weight: 600;
    margin-left: 16px;
  }
  .SectionHeading_more {
    font-size: 0.875rem;
    color: var(--c-navy);
    font-weight: 600;
    white-space: nowrap;
    text-decoration: none;
  }
  .SectionHeading_more:hover {
    text-decoration: underline;
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
      <h2 className="SectionHeading_title" id={id}>
        {title}
      </h2>
      {en && (
        <span className="SectionHeading_en" aria-hidden="true">
          {en}
        </span>
      )}
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
