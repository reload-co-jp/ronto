import type { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { JsonLd } from "@/components/ui/primitives"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"
import "./global.css"

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata({ description: site.description, path: "/" }),
  title: {
    default: `${site.name}（ロント）｜${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  applicationName: site.name,
  publisher: site.publisher.name,
  icons: { icon: "/favicon.svg" },
}

export const viewport: Viewport = {
  themeColor: "#fff7ea",
  width: "device-width",
  initialScale: 1,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <head>
      {/* フォントは Google Fonts から配信（日本語フォントの分割ファイルを成果物に含めない） */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@500;700;900&display=swap"
      />
    </head>
    <body>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <GoogleAnalytics />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
          inLanguage: "ja",
          publisher: {
            "@type": "Organization",
            name: site.publisher.name,
            url: site.publisher.url,
          },
        }}
      />
    </body>
  </html>
)
export default RootLayout
