#!/usr/bin/env node

/**
 * Simple Pre-rendering Script
 * Generates static HTML with proper H1 tags and metadata
 */

const fs = require('fs');
const path = require('path');

// Import structured data utility
const { getStructuredData } = require('./utils/structuredData');

const createPreRenderedHTML = () => {
  // For now, use root paths since custom domain is active
  // GitHub Pages will still work with these paths during transition
  const siteUrl = 'https://edmondaporter.com';
  const basePath = ''; // Use root paths for custom domain
  
  // Read actual build files to get correct paths
  const buildDir = path.join(__dirname, '../build');
  const manifestPath = path.join(buildDir, 'asset-manifest.json');
  
  let jsPath = `${basePath}/static/js/main.a62bebb7.js`;
  let cssPath = `${basePath}/static/css/main.e35003d2.css`;
  
  // Load timeline data and embed it
  let timelineData = [];
  try {
    const timelineDir = path.join(__dirname, '../public/content/timeline');
    if (fs.existsSync(timelineDir)) {
      const files = fs.readdirSync(timelineDir).filter(f => f.endsWith('.json'));
      files.sort((a, b) => parseInt(a.replace('.json', '')) - parseInt(b.replace('.json', '')));
      
      files.forEach(file => {
        const filePath = path.join(timelineDir, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          timelineData.push(data);
        } catch (error) {
          console.warn(`Warning: Could not read ${file}:`, error.message);
        }
      });
    }
  } catch (error) {
    console.warn('Warning: Could not read timeline directory:', error.message);
  }
  
  // Fallback data if no files found
  if (timelineData.length === 0) {
    timelineData = [
      {
        "year": "2014",
        "milestone1_title": "The First Spark",
        "milestone1_description": "Publication of 'Whispers in the Grain' in a leading literary journal, marking his professional debut."
      },
      {
        "year": "2017",
        "milestone1_title": "Crossing the Continent",
        "milestone1_description": "Relocated to the Olympic Peninsula. The rugged landscapes began to heavily influence his work."
      },
      {
        "year": "2021",
        "milestone1_title": "A Breakthrough Release",
        "milestone1_description": "Debut novel 'The Archivist's Daughter' is released to critical acclaim.",
        "milestone2_title": "Literary Award",
        "milestone2_description": "Received recognition for outstanding contribution to contemporary literature."
      },
      {
        "year": "2026",
        "milestone1_title": "First novel published",
        "milestone1_description": "Turbulent Waters releases June 1, 2026"
      }
    ];
  }
  
  try {
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.files && manifest.files['main.js']) {
        jsPath = `${manifest.files['main.js'].replace('./', '/')}`;
      }
      if (manifest.files && manifest.files['main.css']) {
        cssPath = `${manifest.files['main.css'].replace('./', '/')}`;
      }
    }
  } catch (error) {
    console.log('⚠️ Could not read manifest, using default paths');
  }
  
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
  
  // Generate structured data for homepage (both website and book collection)
  const structuredDataSchemas = [
    getStructuredData('website'),
    getStructuredData('bookCollection', { books: booksData })
  ];
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Edmond A Porter - Author Website" />
  <meta name="author" content="Edmond A Porter" />
  <meta name="keywords" content="Edmond Porter, author, contemporary literature, fiction, essays, poetry, Turbulent Waters, The Seasons That Made Me" />
  <meta name="robots" content="index, follow" />
  
  <!-- Google Tag Manager -->
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${process.env.REACT_APP_GTM_ID || '%REACT_APP_GTM_ID%'}');
  </script>
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Edmond A Porter" />
  <meta property="og:title" content="Edmond A Porter | Author" />
  <meta property="og:description" content="Edmond A Porter - Author Website" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:image" content="${siteUrl}/images/Edmond_Headshot.webp" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Edmond A Porter - Contemporary Author" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@edmondporter" />
  <meta name="twitter:creator" content="@edmondporter" />
  <meta name="twitter:title" content="Edmond A Porter | Author" />
  <meta name="twitter:description" content="Edmond A Porter - Author Website" />
  <meta name="twitter:image" content="${siteUrl}/images/Edmond_Headshot.webp" />
  
  <!-- Structured Data -->
${structuredDataSchemas.map(schema => `  <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`).join('\n')}
  
  <!-- Favicon and Theme -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/images/logo192.png" />
  <meta name="theme-color" content="#000000" />
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <title>Edmond A Porter | Author</title>
  <link href="${cssPath}?v=1.0.1" rel="stylesheet">
  <style>
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    .bg-form-bg { 
      background-color: #2F364B !important; 
    }
    .text-form-text { 
      color: #C7CAD1 !important; 
    }
    input.bg-form-bg.text-form-text, 
    textarea.bg-form-bg.text-form-text { 
      background-color: #2F364B !important; 
      color: #C7CAD1 !important; 
    }
    /* Ensure sr-only labels are properly hidden */
    label.sr-only {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
      opacity: 0 !important;
    }
  </style>
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.REACT_APP_GTM_ID || '%REACT_APP_GTM_ID%'}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div class="sr-only">
    <h1>Edmond A Porter</h1>
    <h2>Contemporary Author</h2>
  </div>
  <div id="root"></div>
  <script>
    // Embed timeline data to avoid GitHub Pages routing issues
    window.embeddedTimelineData = ${JSON.stringify(timelineData, null, 2)};
  </script>
  <script src="${jsPath}?v=1.0.1" defer></script>
</body>
</html>`;

  return html;
};

const main = () => {
  console.log('🚀 Generating pre-rendered HTML...');
  
  try {
    const html = createPreRenderedHTML();
    const outputPath = path.join(__dirname, '../build/index.html');
    
    fs.writeFileSync(outputPath, html, 'utf8');
    
    console.log('✅ Pre-rendered HTML generated successfully!');
    console.log(`📄 Output: ${outputPath}`);
    console.log('🏷️ H1 tags and metadata included for SEO');
    
  } catch (error) {
    console.error('❌ Failed to generate pre-rendered HTML:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { createPreRenderedHTML };
