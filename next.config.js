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
  },

  trailingSlash: false,
  output: 'export',
  basePath: '',
  assetPrefix: '',
}

module.exports = nextConfig
