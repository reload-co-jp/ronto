import { css, Style } from "@/components/ui/Style"

const styles = css`
  .Logo {
    font-family: var(--font-sans);
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: 0.01em;
    line-height: 1;
    color: var(--c-navy);
    display: inline-flex;
    align-items: baseline;
  }
  .Logo_to {
    color: var(--c-accent);
  }
  .Logo_dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--c-accent);
    margin-left: 3px;
    display: inline-block;
  }
`

/** テキストロゴ「RonTo」 */
export const Logo = () => (
  <span className="Logo">
    <Style id="Logo">{styles}</Style>
    Ron<span className="Logo_to">To</span>
    <span className="Logo_dot" aria-hidden="true" />
  </span>
)
