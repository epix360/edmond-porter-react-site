/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edmondaporter.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  trailingSlash: false,
  output: 'export',
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
