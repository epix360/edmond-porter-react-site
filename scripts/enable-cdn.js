#!/usr/bin/env node

/**
 * CDN Activation Script
 * Tests CDN status and automatically enables CDN mode if ready
 */

const fs = require('fs');
const path = require('path');
const { testCdnStatus } = require('./test-cdn-status');

const enableCdnMode = () => {
  const cdnUtilsPath = path.join(__dirname, '../src/utils/cdn.js');
  
  try {
    let cdnContent = fs.readFileSync(cdnUtilsPath, 'utf8');
    
    // Check if CDN is currently forced to local mode
    if (cdnContent.includes('return true; // Force local mode')) {
      console.log('🔄 Enabling CDN mode...');
      
      // Replace forced local mode with original logic
      cdnContent = cdnContent.replace(
        // Force local mode for now until CDN is properly configured\n    return true;\n    \n    // Original logic (to be restored later):\n    // return \(\n    //   window\.location\.hostname === 'localhost' \|\|\n    //   window\.location\.hostname === '127\.0\.0\.1' \|\|\n    //   window\.location\.hostname === '' \|\|\n    //   window\.location\.hostname\.includes\('github\.io'\) \|\|\n    //   process\.env\.NODE_ENV === 'development'\n    // \);\);
        `    // Force local mode for now until CDN is properly configured
    return true;
    
    // Original logic (to be restored later):
    // return (
    //   window.location.hostname === 'localhost' ||
    //   window.location.hostname === '127.0.0.1' ||
    //   window.location.hostname === '' ||
    //   window.location.hostname.includes('github.io') ||
    //   process.env.NODE_ENV === 'development'
    // );`,
        `    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      process.env.NODE_ENV === 'development'
    );`
      );
      
      fs.writeFileSync(cdnUtilsPath, cdnContent);
      console.log('✅ CDN mode enabled successfully!');
      console.log('📦 Images will now serve from jsDelivr CDN in production');
      console.log('🏠 Local development will continue using local assets');
      
      return true;
    } else {
      console.log('ℹ️  CDN mode is already enabled');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to enable CDN mode:', error.message);
    return false;
  }
};

const disableCdnMode = () => {
  const cdnUtilsPath = path.join(__dirname, '../src/utils/cdn.js');
  
  try {
    let cdnContent = fs.readFileSync(cdnUtilsPath, 'utf8');
    
    // Check if CDN is currently enabled
    if (!cdnContent.includes('return true; // Force local mode')) {
      console.log('🔄 Disabling CDN mode (forcing local)...');
      
      // Replace original logic with forced local mode
      cdnContent = cdnContent.replace(
        `    return (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '' ||
      process.env.NODE_ENV === 'development'
    );`,
        `    // Force local mode for now until CDN is properly configured
    return true;
    
    // Original logic (to be restored later):
    // return (
    //   window.location.hostname === 'localhost' ||
    //   window.location.hostname === '127.0.0.1' ||
    //   window.location.hostname === '' ||
    //   window.location.hostname.includes('github.io') ||
    //   process.env.NODE_ENV === 'development'
    // );`
      );
      
      fs.writeFileSync(cdnUtilsPath, cdnContent);
      console.log('✅ CDN mode disabled (forced local mode)');
      console.log('📦 All images will serve from local paths');
      
      return true;
    } else {
      console.log('ℹ️  CDN mode is already disabled');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to disable CDN mode:', error.message);
    return false;
  }
};

const main = async () => {
  console.log('🚀 CDN Status Check and Activation\n');
  
  // Test CDN status first
  const { successCount, errorCount, total } = await testCdnStatus();
  
  if (successCount === total) {
    console.log('\n🎉 CDN is ready! Enabling CDN mode...\n');
    enableCdnMode();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Commit the changes: git add src/utils/cdn.js');
    console.log('2. Deploy to GitHub Pages: git push origin main');
    console.log('3. Test the live site to confirm CDN is working');
    
  } else {
    console.log('\n⏳ CDN is not ready yet. Keeping local mode active.');
    console.log('💡 Run this script again in 30-60 minutes to check status.');
    
    // Offer to force disable (already disabled)
    console.log('\n📋 Current Status:');
    console.log('• CDN mode: DISABLED (local assets only)');
    console.log('• Images: Serving from GitHub Pages');
    console.log('• Performance: Working but not optimized');
  }
};

// CLI interface
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'enable':
      enableCdnMode();
      break;
    case 'disable':
      disableCdnMode();
      break;
    case 'status':
      testCdnStatus().then(() => {
        console.log('\n💡 Use "node scripts/enable-cdn.js" to auto-enable when ready');
      });
      break;
    case 'auto':
    default:
      main();
      break;
  }
}

module.exports = { enableCdnMode, disableCdnMode };
