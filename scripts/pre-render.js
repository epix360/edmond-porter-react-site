#!/usr/bin/env node

/**
 * Simple Pre-rendering Script
 * Generates static HTML with proper H1 tags and metadata
 */

const fs = require('fs');
const path = require('path');

const createPreRenderedHTML = () => {
  const siteUrl = 'https://epix360.github.io/edmond-porter-react-site';
  
  // Read the actual build files to get correct paths
  const buildDir = path.join(__dirname, '../build');
  const manifestPath = path.join(buildDir, 'asset-manifest.json');
  
  let jsPath = '/edmond-porter-react-site/static/js/main.a62bebb7.js';
  let cssPath = '/edmond-porter-react-site/static/css/main.e35003d2.css';
  
  try {
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.files && manifest.files['main.js']) {
        jsPath = `/edmond-porter-react-site${manifest.files['main.js'].replace('./', '/')}`;
      }
      if (manifest.files && manifest.files['main.css']) {
        cssPath = `/edmond-porter-react-site${manifest.files['main.css'].replace('./', '/')}`;
      }
    }
  } catch (error) {
    console.log('⚠️ Could not read manifest, using default paths');
  }
  
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
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Edmond A Porter",
    "url": "${siteUrl}",
    "image": "${siteUrl}/images/Edmond_Headshot.webp",
    "sameAs": [
      "https://twitter.com/edmondporter"
    ],
    "jobTitle": "Author",
    "knowsAbout": [
      "Contemporary Literature",
      "Human Experience",
      "Historical Resonance"
    ]
  }
  </script>
  
  <!-- Favicon and Theme -->
  <link rel="icon" href="/edmond-porter-react-site/favicon.ico" />
  <link rel="apple-touch-icon" href="/edmond-porter-react-site/images/logo192.png" />
  <meta name="theme-color" content="#000000" />
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  
  <title>Edmond A Porter | Author</title>
  <link href="${cssPath}" rel="stylesheet">
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
  </style>
</head>
<body>
  <div class="sr-only">
    <h1>Edmond A Porter</h1>
    <h2>Contemporary Author</h2>
  </div>
  <div id="root"></div>
  <script src="${jsPath}" defer></script>
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
