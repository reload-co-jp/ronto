/** ロゴ画像「RonTo」 */
export const Logo = () => (
  // 静的書き出しのため next/image の最適化は使わない
  <img
    className="Logo"
    src="/images/logo.png"
    alt="RonTo"
    width={2172}
    height={724}
    style={{ height: 36, width: "auto", display: "block" }}
  />
)
