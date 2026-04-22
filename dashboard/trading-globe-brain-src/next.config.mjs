/** @type {import('next').NextConfig} */
const basePath = process.env.TRADING_GLOBE_BASE_PATH || "/trading-globe"

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
