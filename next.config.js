/** @type {import('next').NextConfig} */

// 独自ドメイン (rnt.reload.co.jp) で公開するため basePath は使用しない
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
