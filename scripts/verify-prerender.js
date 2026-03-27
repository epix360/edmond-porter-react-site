#!/usr/bin/env node

/**
 * Pre-rendering Verification Script
 * Checks that the pre-rendered HTML contains proper H1 tags and metadata
 */

const fs = require('fs');
const path = require('path');

const verifyPreRenderedHTML = () => {
  const indexPath = path.join(__dirname, '../build/index.html');
  
  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    
    console.log('🔍 Verifying pre-rendered HTML...\n');
    
    // Check for H1 tags
    const hasH1 = html.includes('<h1>');
    console.log(`📋 H1 Tags: ${hasH1 ? '✅ Found' : '❌ Missing'}`);
    
    // Check for meta description
    const hasMetaDescription = html.includes('<meta name="description"');
    console.log(`📋 Meta Description: ${hasMetaDescription ? '✅ Found' : '❌ Missing'}`);
    
    // Check for Open Graph tags
    const hasOGTitle = html.includes('<meta property="og:title"');
    const hasOGDescription = html.includes('<meta property="og:description"');
    const hasOGImage = html.includes('<meta property="og:image"');
    console.log(`📋 Open Graph Tags:`);
    console.log(`   Title: ${hasOGTitle ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Description: ${hasOGDescription ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Image: ${hasOGImage ? '✅ Found' : '❌ Missing'}`);
    
    // Check for Twitter Card tags
    const hasTwitterCard = html.includes('<meta name="twitter:card"');
    const hasTwitterTitle = html.includes('<meta name="twitter:title"');
    console.log(`📋 Twitter Card Tags:`);
    console.log(`   Card: ${hasTwitterCard ? '✅ Found' : '❌ Missing'}`);
    console.log(`   Title: ${hasTwitterTitle ? '✅ Found' : '❌ Missing'}`);
    
    // Check for structured data
    const hasStructuredData = html.includes('<script type="application/ld+json">');
    console.log(`📋 Structured Data (JSON-LD): ${hasStructuredData ? '✅ Found' : '❌ Missing'}`);
    
    // Check for hydration logic in JavaScript file
    const jsPath = path.join(__dirname, '../build/static/js/main.a62bebb7.js');
    const jsContent = fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '';
    const hasHydrationLogic = jsContent.includes('hydrateRoot') || jsContent.includes('hasChildNodes()');
    console.log(`📋 Hydration Logic: ${hasHydrationLogic ? '✅ Found' : '❌ Missing'}`);
    
    console.log('\n📊 Summary:');
    const allChecksPass = hasH1 && hasMetaDescription && hasOGTitle && hasOGDescription && hasOGImage && hasTwitterCard && hasTwitterTitle && hasStructuredData && hasHydrationLogic;
    console.log(`   Overall: ${allChecksPass ? '✅ All checks passed' : '⚠️ Some checks failed'}`);
    
    if (allChecksPass) {
      console.log('\n🎉 Pre-rendering is working correctly!');
      console.log('💡 SEO tools should now find H1 tags and metadata');
      console.log('🔗 Social sharing should work with Open Graph tags');
      console.log('📱 Users will see content before React loads');
    } else {
      console.log('\n⚠️ Some issues detected - check the implementation');
    }
    
    console.log(`\n📄 File: ${indexPath}`);
    
    return {
      hasH1,
      hasMetaDescription,
      hasOGTitle,
      hasOGDescription,
      hasOGImage,
      hasTwitterCard,
      hasTwitterTitle,
      hasStructuredData,
      hasHydrationLogic,
      allChecksPass
    };
    
  } catch (error) {
    console.error('❌ Failed to read pre-rendered HTML:', error.message);
    process.exit(1);
  }
};

const main = () => {
  verifyPreRenderedHTML();
};

if (require.main === module) {
  main();
}

module.exports = { verifyPreRenderedHTML };
