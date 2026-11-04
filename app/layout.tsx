import type { Metadata, Viewport } from "next"
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
  themeColor: "#faf8f4",
  width: "device-width",
  initialScale: 1,
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="ja">
    <body>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
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
