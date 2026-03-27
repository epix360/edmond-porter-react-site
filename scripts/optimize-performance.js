#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Optimizes images and adds resource hints for better performance
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
  
  // Add resource hints for better performance
  const resourceHints = `
  <!-- Performance Optimizations -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://epix360.github.io">
  <link rel="preload" href="/edmond-porter-react-site/public/images/Turbulent_Waters.webp" as="image" fetchpriority="high">
  
  <!-- Critical CSS (inline) -->
  <style>
    /* Prevent flash of unstyled content */
    body { margin: 0; font-family: 'Inter', sans-serif; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
    #root { min-height: 100vh; }
    /* Loading skeleton */
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
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
