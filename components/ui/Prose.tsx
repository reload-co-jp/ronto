import { ReactNode } from "react"
import { css, Style } from "./Style"

const styles = css`
  .Prose {
    padding-bottom: 72px;
    display: grid;
    gap: 16px;
    line-height: 1.95;
  }
  .Prose h2 {
    font-size: 1.3rem;
    line-height: 1.5;
    margin-top: 28px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--c-border);
    scroll-margin-top: 80px;
  }
  .Prose h3 {
    font-size: 1.05rem;
    margin-top: 12px;
  }
  .Prose ul,
  .Prose ol {
    padding-left: 1.4em;
    display: grid;
    gap: 6px;
  }
  .Prose li::marker {
    color: var(--c-accent);
  }
  .Prose a {
    color: var(--c-navy);
    font-weight: 600;
  }
  .Prose .Prose_box {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--radius-sm);
    padding: 18px 20px;
  }
  .Prose .Prose_small {
    font-size: 0.85rem;
    color: var(--c-text-sub);
  }
`

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="Prose">
    <Style id="Prose">{styles}</Style>
    {children}
  </div>
)
