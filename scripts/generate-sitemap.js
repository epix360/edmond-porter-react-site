#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const siteUrl = 'https://epix360.github.io/edmond-porter-react-site';

const pages = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/about', priority: 0.9, changefreq: 'monthly' },
  { url: '/books/the-seasons-that-made-me', priority: 0.8, changefreq: 'monthly' },
  { url: '/books/lucky-penny', priority: 0.8, changefreq: 'monthly' },
  { url: '/books/faithful-hearts', priority: 0.8, changefreq: 'monthly' },
  { url: '/books/the-work-and-the-stories', priority: 0.8, changefreq: 'monthly' },
  { url: '/books/wanderlust', priority: 0.8, changefreq: 'monthly' },
  { url: '/books/turbulent-waters', priority: 0.8, changefreq: 'monthly' }
];

const generateSitemap = () => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemap
  );
  
  console.log('✅ Generated: sitemap.xml');
  console.log(`📍 Sitemap includes ${pages.length} pages`);
};

generateSitemap();
