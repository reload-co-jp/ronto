import Script from "next/script"
import { showDrafts, site } from "@/lib/site"

/**
 * Google Analytics 4 (gtag.js) を読み込む。
 * 本番ビルドのみ有効。開発サーバー・プレビュービルドでは計測しない。
 */
export const GoogleAnalytics = () => {
  if (showDrafts) return null
  const id = site.gaMeasurementId
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  )
}
