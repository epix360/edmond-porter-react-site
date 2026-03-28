#!/usr/bin/env node

/**
 * Custom Build Script
 * Ensures images are copied to build directory for deployment
 */

const fs = require('fs');
const path = require('path');

const copyImages = () => {
  const publicImagesDir = path.join(__dirname, '../public/images');
  const buildImagesDir = path.join(__dirname, '../build/static/images');
  
  // Create build/images directory if it doesn't exist
  if (!fs.existsSync(buildImagesDir)) {
    fs.mkdirSync(buildImagesDir, { recursive: true });
    console.log('📁 Created build/images directory');
  }
  
  // Copy all images from public/images to build/static/images
  try {
    const files = fs.readdirSync(publicImagesDir);
    
    files.forEach(file => {
      const srcPath = path.join(publicImagesDir, file);
      const destPath = path.join(buildImagesDir, file);
      
      fs.copyFileSync(srcPath, destPath);
      console.log(`📷 Copied ${file}`);
    });
    
    console.log(`✅ Copied ${files.length} images to build/static/images/`);
  } catch (error) {
    console.error('❌ Error copying images:', error.message);
  }
};

// Run the function
copyImages();
