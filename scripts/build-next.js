#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const buildNext = () => {
  const projectRoot = path.join(__dirname, '..');
  const srcPagesDir = path.join(projectRoot, 'src/pages');
  const srcPagesBackup = path.join(projectRoot, 'src/pages-backup');
  const nextDir = path.join(projectRoot, '.next');
  
  console.log('🚀 Starting Next.js build with CRA compatibility...');  
  try {
    // Clean any existing .next directory
    if (fs.existsSync(nextDir)) {
      console.log('🧹 Cleaning existing .next directory...');
      fs.rmSync(nextDir, { recursive: true, force: true });
    }
    
    // Check if src/pages exists and temporarily rename it
    if (fs.existsSync(srcPagesDir)) {
      console.log('📁 Temporarily moving src/pages to avoid conflicts...');
      fs.renameSync(srcPagesDir, srcPagesBackup);
    }
    
    // Run Next.js build
    console.log('🔨 Building Next.js app...');
    execSync('npx next build', { stdio: 'inherit', cwd: projectRoot });
    
    console.log('✅ Next.js build completed successfully!');
    
  } catch (error) {
    console.error('❌ Next.js build failed:', error.message);
    process.exit(1);
  } finally {
    // Restore src/pages if it was backed up
    if (fs.existsSync(srcPagesBackup)) {
      console.log('📁 Restoring src/pages directory...');
      fs.renameSync(srcPagesBackup, srcPagesDir);
    }
  }
};

const devNext = () => {
  const projectRoot = path.join(__dirname, '..');
  const srcPagesDir = path.join(projectRoot, 'src/pages');
  const srcPagesBackup = path.join(projectRoot, 'src/pages-backup');
  
  console.log('🚀 Starting Next.js dev server with CRA compatibility...');  
  try {
    // Check if src/pages exists and temporarily rename it
    if (fs.existsSync(srcPagesDir)) {
      console.log('📁 Temporarily moving src/pages to avoid conflicts...');
      fs.renameSync(srcPagesDir, srcPagesBackup);
    }
    
    // Run Next.js dev server
    console.log('🔨 Starting Next.js dev server...');
    execSync('npx next dev', { stdio: 'inherit', cwd: projectRoot });
    
  } catch (error) {
    console.error('❌ Next.js dev server failed:', error.message);
    process.exit(1);
  } finally {
    // Restore src/pages if it was backed up
    if (fs.existsSync(srcPagesBackup)) {
      console.log('📁 Restoring src/pages directory...');
      fs.renameSync(srcPagesBackup, srcPagesDir);
    }
  }
};

// Command line argument handling
const command = process.argv[2];

if (command === 'build') {
  buildNext();
} else if (command === 'dev') {
  devNext();
} else {
  console.log('Usage: node scripts/build-next.js [build|dev]');
  process.exit(1);
}
