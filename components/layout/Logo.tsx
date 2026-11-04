import { css, Style } from "@/components/ui/Style"

const styles = css`
  .Logo {
    font-family: var(--font-sans);
    font-weight: 900;
    font-size: 1.55rem;
    letter-spacing: 0.01em;
    line-height: 1;
    color: var(--c-ink);
    display: inline-flex;
    align-items: center;
  }
  .Logo_to {
    color: var(--c-accent);
  }
  .Logo_bubble {
    position: relative;
    display: inline-block;
    width: 22px;
    height: 16px;
    border-radius: 8px;
    background: var(--c-yellow);
    border: 2px solid var(--c-ink);
    margin-left: 4px;
    transform: translateY(-6px) rotate(6deg);
  }
  .Logo_bubble::after {
    content: "";
    position: absolute;
    left: 3px;
    bottom: -6px;
    border: 4px solid transparent;
    border-top-color: var(--c-ink);
  }
`

/** テキストロゴ「RonTo」 */
export const Logo = () => (
  <span className="Logo">
    <Style id="Logo">{styles}</Style>
    Ron<span className="Logo_to">To</span>
    <span className="Logo_bubble" aria-hidden="true" />
  </span>
)
