#!/usr/bin/env node

/**
 * Static Page Generator for SEO
 * Generates static HTML files for each route to ensure full page source is available to search engines
 */

const fs = require('fs');
const path = require('path');

// Import structured data utility
const { getStructuredData } = require('./utils/structuredData');

const generateStaticPages = () => {
  const buildDir = path.join(__dirname, '../build');
  
  // Read the main index.html to get the base structure
  const indexPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ build/index.html not found. Run build first.');
    return;
  }
  
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Define routes to generate static pages for
  const routes = [
    {
      path: 'about.html',
      title: 'About Edmond A Porter | Author',
      description: 'Learn about Edmond A Porter, contemporary author exploring human experience through compelling narratives. Discover his biography, literary achievements, and writing journey.',
      canonicalUrl: '/about',
      ogImage: '/images/Edmond_Seated.webp',
      structuredDataType: 'author'
    },
    {
      path: 'books.html',
      title: 'Books by Edmond A Porter | Author',
      description: 'Explore the complete collection of books by Edmond A Porter, including contemporary fiction, essays, and poetry that explore the human experience.',
      canonicalUrl: '/books',
      ogImage: '/images/Turbulent_Waters.webp',
      structuredDataType: 'website'
    }
  ];
  
  routes.forEach(route => {
    // Generate structured data for this route
    const structuredData = getStructuredData(route.structuredDataType);
    
    // Create route-specific HTML by modifying the index.html
    let routeHtml = indexHtml;
    
    // Update title
    routeHtml = routeHtml.replace(
      /<title>Edmond A Porter \| Author<\/title>/,
      `<title>${route.title}</title>`
    );
    
    // Update meta description
    routeHtml = routeHtml.replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${route.description}" />`
    );
    
    // Update Open Graph tags
    routeHtml = routeHtml.replace(
      /<meta property="og:title" content="[^"]*"\/>/,
      `<meta property="og:title" content="${route.title}" />`
    );
    
    routeHtml = routeHtml.replace(
      /<meta property="og:description" content="[^"]*"\/>/,
      `<meta property="og:description" content="${route.description}" />`
    );
    
    routeHtml = routeHtml.replace(
      /<meta property="og:url" content="https:\/\/edmondaporter\.com"\/>/,
      `<meta property="og:url" content="https://edmondaporter.com${route.canonicalUrl}" />`
    );
    
    routeHtml = routeHtml.replace(
      /<meta property="og:image" content="[^"]*"\/>/,
      `<meta property="og:image" content="https://edmondaporter.com${route.ogImage}" />`
    );
    
    // Update Twitter Card tags
    routeHtml = routeHtml.replace(
      /<meta name="twitter:title" content="[^"]*"\/>/,
      `<meta name="twitter:title" content="${route.title}" />`
    );
    
    routeHtml = routeHtml.replace(
      /<meta name="twitter:description" content="[^"]*"\/>/,
      `<meta name="twitter:description" content="${route.description}" />`
    );
    
    routeHtml = routeHtml.replace(
      /<meta name="twitter:image" content="[^"]*"\/>/,
      `<meta name="twitter:image" content="https://edmondaporter.com${route.ogImage}" />`
    );
    
    // Update canonical URL (add it if it doesn't exist)
    if (routeHtml.includes('<link rel="canonical"')) {
      routeHtml = routeHtml.replace(
        /<link rel="canonical" href="[^"]*"\/>/,
        `<link rel="canonical" href="https://edmondaporter.com${route.canonicalUrl}" />`
      );
    } else {
      // Add canonical URL after meta tags
      routeHtml = routeHtml.replace(
        /<meta name="robots" content="[^"]*" \/>/,
        `<meta name="robots" content="index, follow" />\n  <link rel="canonical" href="https://edmondaporter.com${route.canonicalUrl}" />`
      );
    }
    
    // Update structured data
    routeHtml = routeHtml.replace(
      /<script type="application\/ld\+json">\s*\{[\s\S]*?\}\s*<\/script>/,
      `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n  </script>`
    );
    
    // Write the static page
    const routePath = path.join(buildDir, route.path);
    fs.writeFileSync(routePath, routeHtml, 'utf8');
    
    console.log(`✅ Generated static page: ${route.path}`);
  });
  
  console.log('\n🎉 Static pages generated successfully!');
  console.log('📄 SEO-friendly pages are now available for search engines');
};

if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages };
