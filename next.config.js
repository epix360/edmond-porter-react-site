/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure turbopack to avoid webpack conflicts and set correct root
  turbopack: {

  },

  // Configure custom headers for static asset caching
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // Exclude src/pages directory to avoid conflicts with CRA
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Disable TypeScript type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configure image optimization
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
  
  // Configure trailing slash
  trailingSlash: false,
  
  // Configure output for static export
  output: 'export',
  
  // Configure base path for GitHub Pages
  basePath: '',
  
  // Configure asset prefix for GitHub Pages
  assetPrefix: '',
  
  // Configure webpack to ignore src/pages
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude src/pages from Next.js processing
    config.resolve.alias = {
      ...config.resolve.alias,
      '@pages': false,
    }
    
    // Ignore src/pages directory completely
    if (config.resolve.plugins) {
      config.resolve.plugins.push({
        apply: (compiler) => {
          compiler.hooks.compilation.tap('IgnoreSrcPages', (compilation) => {
            compilation.contextDependencies = compilation.contextDependencies.filter(
              dep => !dep.includes('src/pages')
            );
          });
        }
      });
    }
    
    return config
  },
}

module.exports = nextConfig
