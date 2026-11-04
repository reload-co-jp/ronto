/**
 * コンポーネント単位の CSS-in-JS。
 *
 * React 19 の <style href precedence> を利用し、サーバーコンポーネント・
 * クライアントコンポーネントのどちらからでもスタイルを <head> に集約する。
 * 同じ id のスタイルは何度描画されても1回だけ出力される（ランタイム依存なし）。
 *
 * 使い方:
 *   const styles = css`.Card_root { ... }`
 *   <Style id="Card">{styles}</Style>
 *
 * クラス名は「コンポーネント名_要素名」で命名し、衝突を防ぐ。
 */
export const css = (strings: TemplateStringsArray, ...values: unknown[]) =>
  String.raw({ raw: strings }, ...values)
    .replace(/\s+/g, " ")
    .trim()

export const Style = ({ id, children }: { id: string; children: string }) => (
  <style href={`ronto-${id}`} precedence="default">
    {children}
  </style>
)

/** ブレークポイント */
export const mq = {
  tablet: "@media (min-width: 640px)",
  desktop: "@media (min-width: 960px)",
}
