/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure turbopack to avoid webpack conflicts and set correct root
  turbopack: {

  },

  // NOTE: a `headers()` block used to live here to set long Cache-Control
  // on /_next/static/*, but `headers()` is ignored under `output: 'export'`
  // (Next.js only applies it from its runtime server). GitHub Pages serves
  // everything with its own fixed 10-minute cache TTL and doesn't read this
  // file. Reintroduce a `public/_headers` file (Cloudflare Pages / Netlify)
  // or front the site with Cloudflare's proxy if/when we want long TTLs.

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
