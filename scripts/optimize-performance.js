#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Optimizes images and adds resource hints for better performance
 * Updated: 2026-04-04 - Font display optimization implemented
 */

const fs = require('fs');
const path = require('path');

const createOptimizedIndexHTML = () => {
  const buildDir = path.join(__dirname, '../build');
  const indexPath = path.join(buildDir, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log('❌ build/index.html not found. Run build first.');
    return;
  }
  
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Find the actual CSS and JS filenames from the build
  const cssDir = path.join(buildDir, 'static/css');
  const jsDir = path.join(buildDir, 'static/js');
  
  let cssFile = null;
  let jsFile = null;
  
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css') && !f.endsWith('.map'));
    cssFile = cssFiles[0];
  }
  
  if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
    jsFile = jsFiles[0];
  }
  
  // Add resource hints for better performance
  const resourceHints = `
  <!-- Performance Optimizations -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link rel="preload" href="https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/public/images/Turbulent_Waters.webp" as="image" fetchpriority="high">
  <link rel="preload" href="https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/public/images/Edmond_Headshot.webp" as="image" fetchpriority="high">
  <link rel="preload" href="/static/css/${cssFile || 'main.css'}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://www.google-analytics.com">
  
  <!-- Web Font Loader for async font loading -->
  <script>
    (function(d) {
      var config = {
        kitId: 'custom',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);
    
    // Custom font loading configuration
    WebFontConfig = {
      google: {
        families: [
          'Inter:wght@300;400;500;600;700&display=swap',
          'Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
          'Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
        ],
        display: 'swap'
      },
      timeout: 3000,
      active: function() {
        document.body.classList.add('fonts-loaded');
      },
      inactive: function() {
        console.log('Fonts failed to load - using system fonts');
        document.body.classList.add('fonts-failed');
      }
    };
  </script>
  
  <!-- Critical CSS (inline) -->
  <style>
    /* Prevent flash of unstyled content */
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    #root { min-height: 100vh; }
    /* Loading skeleton */
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    /* Font loading states */
    .wf-loading body { opacity: 1; }
    .wf-inactive body { opacity: 1; }
    .wf-active body { opacity: 1; }
    
    /* Font metric overrides to prevent layout shifts */
    @font-face {
      font-family: 'Inter-fallback';
      size-adjust: 92.5%;
      ascent-override: 95%;
      descent-override: 30%;
      line-gap-override: 10%;
      src: local('Arial');
    }
    
    @font-face {
      font-family: 'Noto-Serif-fallback';
      size-adjust: 95%;
      ascent-override: 90%;
      descent-override: 25%;
      line-gap-override: 8%;
      src: local('Georgia');
    }
    
    @font-face {
      font-family: 'Material-Symbols-fallback';
      size-adjust: 100%;
      ascent-override: 85%;
      descent-override: 20%;
      line-gap-override: 5%;
      src: local('Arial');
    }
    
    /* Apply fallback fonts during loading */
    .wf-loading .font-inter { font-family: 'Inter-fallback', -apple-system, BlinkMacSystemFont, sans-serif; }
    .wf-loading .font-noto-serif { font-family: 'Noto-Serif-fallback', Georgia, serif; }
    .wf-loading .font-material-symbols { font-family: 'Material-Symbols-fallback', Arial, sans-serif; }
    
    /* Smooth transition when fonts load */
    .wf-active .font-inter { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      transition: font-family 0.1s ease-in-out;
    }
    .wf-active .font-noto-serif { 
      font-family: 'Noto Serif', Georgia, serif;
      transition: font-family 0.1s ease-in-out;
    }
    .wf-active .font-material-symbols { 
      font-family: 'Material Symbols Outlined', Arial, sans-serif;
      transition: font-family 0.1s ease-in-out;
    }
    
    /* Ensure text remains visible during font loading */
    .wf-loading body {
      font-family: 'Inter-fallback', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Prevent layout shift with font swap */
    * {
      font-display: swap;
    }
  </style>`;
  
  // Insert resource hints after charset meta tag
  html = html.replace(
    /<meta charset="utf-8" \/>/,
    `<meta charset="utf-8" />${resourceHints}`
  );
  
  // Add loading="eager" to hero image for LCP
  html = html.replace(
    /<img[^>]*src="[^"]*Turbulent_Waters\.webp"[^>]*>/,
    match => match.replace('loading="lazy"', 'loading="eager" fetchpriority="high"')
  );
  
  // Add width/height attributes to prevent layout shift
  const imageSizes = {
    'Turbulent_Waters.webp': '1200x800',
    'Edmond_Headshot.webp': '400x400',
    'The_Seasons_That_Made_Me.webp': '300x450'
  };
  
  Object.entries(imageSizes).forEach(([filename, dimensions]) => {
    const [width, height] = dimensions.split('x');
    const regex = new RegExp(`(<img[^>]*src="[^"]*${filename}"[^>]*)(>)`, 'g');
    html = html.replace(regex, (match, p1, p2) => {
      if (!p1.includes('width=')) {
        return `${p1} width="${width}" height="${height}"${p2}`;
      }
      return match;
    });
  });
  
  // Remove blocking font links from the HTML (they're now loaded async)
  html = html.replace(/<link[^>]*href="https:\/\/fonts\.googleapis\.com\/css[^"]*"[^>]*>/g, '');
  
  // Remove original blocking CSS link (replaced with preload)
  html = html.replace(/<link[^>]*href="\/static\/css\/[^"]*\.css[^"]*"[^>]*rel="stylesheet"[^>]*>/g, '');
  
  // Fix any remaining GitHub Pages base paths
  html = html.replace(/\/edmond-porter-react-site\/favicon\.ico/g, '/favicon.ico');
  html = html.replace(/\/edmond-porter-react-site\/images\/logo192\.png/g, '/images/logo192.png');
  
  // Fix any remaining double path issues in CSS and JS links
  html = html.replace(/href="\/[^"]*\/static\//g, 'href="/static/');
  html = html.replace(/src="\/[^"]*\/static\//g, 'src="/static/');
  
  fs.writeFileSync(indexPath, html);
  console.log('✅ Performance optimizations applied to index.html');
};

const optimizeImageSuggestions = () => {
  const imageDir = path.join(__dirname, '../public/images');
  const images = fs.readdirSync(imageDir).filter(file => file.endsWith('.webp'));
  
  console.log('\n📊 Image Optimization Suggestions:');
  console.log('=====================================');
  
  images.forEach(image => {
    const imagePath = path.join(imageDir, image);
    const stats = fs.statSync(imagePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    console.log(`\n🖼️  ${image}`);
    console.log(`   Current size: ${sizeKB} KB`);
    
    if (sizeKB > 150) {
      console.log('   ⚠️  Consider: Reducing quality to 80-85%');
      console.log('   💡 Suggestion: Use responsive images with srcset');
    } else if (sizeKB > 100) {
      console.log('   💡 Consider: Slightly reducing quality');
    } else {
      console.log('   ✅ Good size for web');
    }
  });
  
  console.log('\n🚀 Additional Performance Tips:');
  console.log('- Use next-gen formats (WebP - already done!)');
  console.log('- Implement progressive image loading');
  console.log('- Consider image CDNs for better caching');
  console.log('- Use resource hints (preconnect, dns-prefetch)');
};

const main = () => {
  console.log('🚀 Applying performance optimizations...');
  
  try {
    createOptimizedIndexHTML();
    optimizeImageSuggestions();
    
    console.log('\n✅ Performance optimization complete!');
    console.log('📈 Expected improvements:');
    console.log('   - Reduced Largest Contentful Paint (LCP)');
    console.log('   - Better Cumulative Layout Shift (CLS)');
    console.log('   - Improved First Contentful Paint (FCP)');
    console.log('   - Enhanced user experience with loading states');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { createOptimizedIndexHTML, optimizeImageSuggestions };
