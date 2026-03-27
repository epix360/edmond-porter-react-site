#!/usr/bin/env node

/**
 * Generate version tag for jsDelivr CDN
 * Creates a git tag for the current version to ensure stable CDN URLs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const generateVersionTag = () => {
  const version = packageJson.version;
  const tag = `v${version}`;
  
  try {
    // Check if tag already exists
    const existingTag = execSync(`git tag -l ${tag}`, { encoding: 'utf8' }).trim();
    
    if (existingTag) {
      console.log(`📋 Tag ${tag} already exists`);
      return tag;
    }
    
    // Create and push tag
    console.log(`🏷️  Creating version tag: ${tag}`);
    
    // Check if there are any changes to commit
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    
    if (status) {
      // Add current changes
      execSync('git add .', { stdio: 'inherit' });
      
      // Try to commit, but don't fail if no changes to commit
      try {
        execSync(`git commit -m "Release version ${version}"`, { stdio: 'inherit' });
        console.log(`📝 Committed changes for version ${version}`);
      } catch (error) {
        console.log(`ℹ️  No new changes to commit, proceeding with tag creation`);
      }
    } else {
      console.log(`ℹ️  No uncommitted changes found`);
    }
    
    // Create tag
    execSync(`git tag ${tag}`, { stdio: 'inherit' });
    
    // Push tag to remote
    execSync(`git push origin ${tag}`, { stdio: 'inherit' });
    
    console.log(`✅ Version tag ${tag} created and pushed`);
    console.log(`🌐 CDN URL: https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@${tag}/`);
    
    return tag;
  } catch (error) {
    console.error('❌ Failed to create version tag:', error.message);
    // Don't exit with error, just log and continue
    console.log('⚠️  Continuing without version tag - CDN will use main branch');
    return null;
  }
};

// Update CDN utility with version info
const updateCdnConfig = (version) => {
  const cdnUtilsPath = path.join(__dirname, '../src/utils/cdn.js');
  let cdnContent = fs.readFileSync(cdnUtilsPath, 'utf8');
  
  // Update version in CDN config
  cdnContent = cdnContent.replace(
    /version: '.*?'/,
    `version: '${version}'`
  );
  
  fs.writeFileSync(cdnUtilsPath, cdnContent);
  console.log(`📝 Updated CDN configuration with version ${version}`);
};

// Main execution
if (require.main === module) {
  console.log('🚀 Generating version tag for jsDelivr CDN...');
  
  const version = packageJson.version;
  const tag = generateVersionTag();
  
  if (tag) {
    updateCdnConfig(version);
    console.log('\n🎉 Version tag generation complete!');
    console.log(`📦 Version: ${version}`);
    console.log(`🏷️  Tag: ${tag}`);
    console.log(`🌐 CDN Base URL: https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@${tag}/`);
    console.log('\n💡 Use this tag in production for stable CDN URLs');
  } else {
    console.log('\n⚠️  Version tag generation skipped');
    console.log(`📦 Version: ${version}`);
    console.log(`🌐 CDN will use main branch: https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/`);
    console.log('\n💡 CDN will still work, but without version-specific caching');
  }
}

module.exports = { generateVersionTag, updateCdnConfig };
