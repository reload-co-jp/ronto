import type { Metadata, Viewport } from "next"
import { Zen_Maru_Gothic } from "next/font/google"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { JsonLd } from "@/components/ui/primitives"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"
import "./global.css"

const maru = Zen_Maru_Gothic({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-maru",
  preload: false,
})

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
  <html lang="ja" className={maru.variable}>
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
