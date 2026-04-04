#!/usr/bin/env node

/**
 * Unified Build Script
 * Combines all optimization steps into one efficient process
 * Replaces: build → pre-render → optimize → static-pages → service-worker
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const unifiedBuild = () => {
  console.log('🚀 Starting unified build process...');
  
  // Clean previous build
  const buildDir = path.join(__dirname, '../build');
  if (fs.existsSync(buildDir)) {
    console.log('🧹 Cleaning previous build...');
    execSync(`rm -rf ${buildDir}`, { stdio: 'inherit' });
  }
  
  // Run React build
  console.log('⚛️ Building React application...');
  const buildResult = execSync('npx react-scripts build', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  if (buildResult.status !== 0) {
    console.error('❌ React build failed');
    process.exit(1);
  }
  
  // Run pre-render with optimizations
  console.log('📝 Pre-rendering HTML with optimizations...');
  const preRenderResult = execSync('node scripts/pre-render', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  if (preRenderResult.status !== 0) {
    console.error('❌ Pre-render failed');
    process.exit(1);
  }
  
  // Generate static pages
  console.log('📄 Generating static pages...');
  const staticPagesResult = execSync('node scripts/generate-static-pages', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  if (staticPagesResult.status !== 0) {
    console.error('❌ Static pages generation failed');
    process.exit(1);
  }
  
  // Generate service worker
  console.log('🔧 Generating service worker...');
  const serviceWorkerResult = execSync('node scripts/generate-service-worker', { 
    stdio: 'inherit',
    encoding: 'utf8'
  });
  
  if (serviceWorkerResult.status !== 0) {
    console.error('❌ Service worker generation failed');
    process.exit(1);
  }
  
  console.log('✅ Unified build completed successfully!');
  console.log('⏱️ Build time:', process.uptime(), 'seconds');
  
  // Verify build artifacts
  const indexPath = path.join(buildDir, 'index.html');
  const jsDir = path.join(buildDir, 'static/js');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Build artifacts not found');
    process.exit(1);
  }
  
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
  if (jsFiles.length === 0) {
    console.error('❌ No JS bundle found');
    process.exit(1);
  }
  
  const mainBundle = jsFiles[0];
  const bundleSize = fs.statSync(path.join(jsDir, mainBundle)).size;
  
  console.log(`📊 Bundle: ${mainBundle} (${bundleSize} bytes)`);
  console.log('🎯 Build optimized and ready for deployment!');
};

if (require.main === module) {
  unifiedBuild();
}

module.exports = { unifiedBuild };
