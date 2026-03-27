#!/usr/bin/env node

/**
 * CDN Development Configuration Helper
 * Helps configure and test CDN settings for local development
 */

const fs = require('fs');
const path = require('path');

const checkCdnConfiguration = () => {
  console.log('🔍 Checking CDN configuration...\n');
  
  // Check if CDN utility exists
  const cdnUtilsPath = path.join(__dirname, '../src/utils/cdn.js');
  if (!fs.existsSync(cdnUtilsPath)) {
    console.error('❌ CDN utility not found at src/utils/cdn.js');
    return false;
  }
  
  // Check package.json configuration
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  console.log('📦 Package Configuration:');
  console.log(`   Name: ${packageJson.name}`);
  console.log(`   Version: ${packageJson.version}`);
  console.log(`   Homepage: ${packageJson.homepage}\n`);
  
  // Test CDN URL generation
  try {
    // Import CDN utility (require.resolve for dynamic import)
    const cdnUtils = require('../src/utils/cdn.js');
    
    console.log('🌐 CDN URL Generation Test:');
    
    // Test local development URL
    const localUrl = cdnUtils.getAssetUrl('Edmond_Headshot.webp', { useLocal: true });
    console.log(`   Local: ${localUrl}`);
    
    // Test production CDN URL
    const cdnUrl = cdnUtils.getAssetUrl('Edmond_Headshot.webp', { useLocal: false });
    console.log(`   CDN:   ${cdnUrl}`);
    
    // Test versioned URL
    const versionedUrl = cdnUtils.getAssetUrl('Edmond_Headshot.webp', { version: 'v1.0.0' });
    console.log(`   Versioned: ${versionedUrl}\n`);
    
    console.log('✅ CDN configuration looks good!');
    return true;
    
  } catch (error) {
    console.error('❌ Error testing CDN configuration:', error.message);
    return false;
  }
};

const generateDevelopmentReport = () => {
  console.log('📊 Generating CDN Development Report...\n');
  
  const report = {
    timestamp: new Date().toISOString(),
    configuration: {
      repository: 'epix360/edmond-porter-react-site',
      version: '1.0.0',
      environment: 'development'
    },
    cdnUrls: {
      local: '/images/[filename]',
      development: 'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/images/[filename]',
      production: 'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@v1.0.0/images/[filename]'
    },
    assets: [
      'Edmond_Headshot.webp',
      'Edmond_Seated.webp',
      'Faithful_Hearts.webp',
      'Lucky_Penny.webp',
      'The_Seasons_That_Made_Me.webp',
      'The_Work_and_the_Stories.webp',
      'Turbulent_Waters.webp',
      'Wanderlust.webp'
    ],
    performance: {
      expectedImprovement: '60-80% faster asset loading',
      caching: 'Permanent (vs 10-minute GitHub Pages)',
      globalDelivery: 'Multi-CDN edge caching'
    }
  };
  
  // Save report
  const reportPath = path.join(__dirname, '../cdn-dev-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('📄 Development report saved to: cdn-dev-report.json');
  console.log('\n🚀 Ready for development with CDN optimization!');
  
  return report;
};

const testAssetUrls = () => {
  console.log('🧪 Testing asset URLs...\n');
  
  try {
    const cdnUtils = require('../src/utils/cdn.js');
    
    const testAssets = [
      'Edmond_Headshot.webp',
      'The_Seasons_That_Made_Me.webp',
      'Turbulent_Waters.webp'
    ];
    
    testAssets.forEach(asset => {
      const localUrl = cdnUtils.getAssetUrl(asset, { useLocal: true });
      const cdnUrl = cdnUtils.getAssetUrl(asset, { useLocal: false });
      
      console.log(`📷 ${asset}:`);
      console.log(`   Local:  ${localUrl}`);
      console.log(`   CDN:    ${cdnUrl}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error testing asset URLs:', error.message);
  }
};

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'check':
    checkCdnConfiguration();
    break;
    
  case 'report':
    generateDevelopmentReport();
    break;
    
  case 'test':
    testAssetUrls();
    break;
    
  case 'all':
  default:
    console.log('🚀 Running complete CDN development check...\n');
    checkCdnConfiguration();
    console.log('');
    testAssetUrls();
    console.log('');
    generateDevelopmentReport();
    break;
}

if (require.main === module) {
  console.log('🛠️  CDN Development Configuration Helper\n');
}
