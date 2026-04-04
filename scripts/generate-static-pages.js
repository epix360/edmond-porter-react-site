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
  
  // Load books data for structured data
  let booksData = [];
  try {
    const booksPath = path.join(__dirname, '../public/content/books-index.json');
    if (fs.existsSync(booksPath)) {
      const booksContent = fs.readFileSync(booksPath, 'utf8');
      booksData = JSON.parse(booksContent);
    }
  } catch (error) {
    console.warn('Warning: Could not load books data:', error.message);
  }
  
  // Define routes to generate static pages for
  const routes = [
    {
      path: 'about.html',
      title: 'About Edmond A Porter | Author',
      description: 'Learn about Edmond A Porter, contemporary author exploring human experience through compelling narratives. Discover his biography, literary achievements, and writing journey.',
      canonicalUrl: '/about',
      ogImage: '/images/Edmond_Seated.webp',
      structuredData: [
        { type: 'author' }
      ]
    },
    {
      path: 'books.html',
      title: 'Books by Edmond A Porter | Author',
      description: 'Explore the complete collection of books by Edmond A Porter, including contemporary fiction, essays, and poetry that explore the human experience.',
      canonicalUrl: '/books',
      ogImage: '/images/Turbulent_Waters.webp',
      structuredData: [
        { type: 'website' },
        { type: 'bookCollection', data: { books: booksData } }
      ]
    }
  ];
  
  routes.forEach(route => {
    // Generate structured data for this route (handle multiple schemas)
    const structuredDataSchemas = route.structuredData.map(sd => getStructuredData(sd.type, sd.data));
    
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
    
    // Update apple-touch-icon
    routeHtml = routeHtml.replace(
      /<link rel="apple-touch-icon" href="[^"]*" \/>/,
      `<link rel="apple-touch-icon" href="/pen.png" />`
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
    
    // Update structured data (handle multiple schemas)
    // Remove existing structured data scripts
    routeHtml = routeHtml.replace(
      /<script type="application\/ld\+json">\s*\{[\s\S]*?\}\s*<\/script>/g,
      ''
    );
    
    // Add all structured data schemas
    const structuredDataScripts = structuredDataSchemas.map(schema => 
      `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`
    ).join('\n');
    
    // Insert structured data before the closing head or before the next script
    const insertPosition = routeHtml.indexOf('</head>') !== -1 
      ? routeHtml.indexOf('</head>')
      : routeHtml.indexOf('<script');
    
    routeHtml = routeHtml.slice(0, insertPosition) + 
      '\n' + structuredDataScripts + '\n' + 
      routeHtml.slice(insertPosition);
    
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
