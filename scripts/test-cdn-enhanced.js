#!/usr/bin/env node

/**
 * Enhanced CDN Status Testing Script
 * Tests multiple CDN endpoints and provides troubleshooting guidance
 */

const https = require('https');
const http = require('http');

const testUrls = [
  // jsDelivr tests (corrected paths)
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/public/images/Turbulent_Waters.webp',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/public/images/Lucky_Penny.webp',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/public/images/Edmond_Headshot.webp',
  
  // GitHub Raw tests (corrected paths)
  'https://raw.githubusercontent.com/epix360/edmond-porter-react-site/main/public/images/Turbulent_Waters.webp',
  'https://raw.githubusercontent.com/epix360/edmond-porter-react-site/main/public/images/Lucky_Penny.webp',
  'https://raw.githubusercontent.com/epix360/edmond-porter-react-site/main/public/images/Edmond_Headshot.webp',
  
  // GitHub Pages tests (current)
  'https://epix360.github.io/edmond-porter-react-site/images/Turbulent_Waters.webp',
  'https://epix360.github.io/edmond-porter-react-site/images/Lucky_Penny.webp',
  'https://epix360.github.io/edmond-porter-react-site/images/Edmond_Headshot.webp'
];

const testUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    const startTime = Date.now();
    
    const request = protocol.request(url, { 
      method: 'HEAD', 
      timeout: 15000,
      headers: {
        'User-Agent': 'CDN-Status-Test/1.0'
      }
    }, (response) => {
      const endTime = Date.now();
      resolve({
        url,
        status: response.statusCode,
        statusText: response.statusMessage,
        headers: response.headers,
        responseTime: endTime - startTime
      });
    });

    request.on('error', (error) => {
      const endTime = Date.now();
      resolve({
        url,
        status: 'ERROR',
        statusText: error.message,
        headers: {},
        responseTime: endTime - startTime
      });
    });

    request.on('timeout', () => {
      request.destroy();
      const endTime = Date.now();
      resolve({
        url,
        status: 'TIMEOUT',
        statusText: 'Request timeout',
        headers: {},
        responseTime: endTime - startTime
      });
    });

    request.end();
  });
};

const categorizeUrl = (url) => {
  if (url.includes('cdn.jsdelivr.net')) return 'jsDelivr CDN';
  if (url.includes('raw.githubusercontent.com')) return 'GitHub Raw';
  if (url.includes('epix360.github.io')) return 'GitHub Pages';
  return 'Unknown';
};

const analyzeResults = (results) => {
  const categories = {
    'jsDelivr CDN': { success: 0, total: 0, urls: [] },
    'GitHub Raw': { success: 0, total: 0, urls: [] },
    'GitHub Pages': { success: 0, total: 0, urls: [] }
  };

  results.forEach(result => {
    const category = categorizeUrl(result.url);
    categories[category].total++;
    categories[category].urls.push(result);
    
    if (result.status === 200) {
      categories[category].success++;
    }
  });

  return categories;
};

const provideRecommendations = (categories) => {
  console.log('\n🎯 Recommendations:');
  console.log('==================');
  
  const jsdelivrSuccess = categories['jsDelivr CDN'].success;
  const jsdelivrTotal = categories['jsDelivr CDN'].total;
  const githubPagesSuccess = categories['GitHub Pages'].success;
  const githubPagesTotal = categories['GitHub Pages'].total;
  
  if (jsdelivrSuccess === jsdelivrTotal) {
    console.log('✅ jsDelivr CDN is ready! You can enable CDN mode.');
    console.log('💡 Run: node scripts/enable-cdn.js');
  } else if (jsdelivrSuccess > 0) {
    console.log('⚠️  jsDelivr CDN is partially ready.');
    console.log('💡 Wait a bit more for full indexing, or use GitHub Pages as fallback.');
  } else {
    console.log('⏳ jsDelivr CDN is not ready yet.');
    console.log('💡 This is normal for new repositories. Wait 30-60 minutes.');
  }
  
  if (githubPagesSuccess === githubPagesTotal) {
    console.log('✅ GitHub Pages is working perfectly as fallback.');
    console.log('💡 Your site is already working with local mode.');
  }
  
  if (jsdelivrSuccess === 0 && githubPagesSuccess === githubPagesTotal) {
    console.log('\n🔧 Suggested Action:');
    console.log('Keep using local mode (current setup) until jsDelivr is ready.');
    console.log('Your site is working fine with GitHub Pages hosting.');
  }
};

const testCdnStatus = async () => {
  console.log('🔍 Enhanced CDN Status Test...\n');
  
  const results = await Promise.all(testUrls.map(testUrl));
  const categories = analyzeResults(results);
  
  // Display results by category
  Object.entries(categories).forEach(([category, data]) => {
    console.log(`\n📁 ${category}:`);
    console.log(`   Success: ${data.success}/${data.total}`);
    
    data.urls.forEach(result => {
      const fileName = result.url.split('/').pop() || 'root';
      const time = result.responseTime ? `${result.responseTime}ms` : 'N/A';
      
      console.log(`   📄 ${fileName}:`);
      console.log(`      Status: ${result.status} ${result.statusText}`);
      console.log(`      Time: ${time}`);
      
      if (result.status === 200) {
        console.log(`      ✅ SUCCESS - Accessible`);
        if (result.headers['content-type']) {
          console.log(`      📄 Type: ${result.headers['content-type']}`);
        }
        if (result.headers['cache-control']) {
          console.log(`      💾 Cache: ${result.headers['cache-control']}`);
        }
      } else if (result.status === 403) {
        console.log(`      ❌ FORBIDDEN - Not indexed yet`);
      } else if (result.status === 404) {
        console.log(`      ❌ NOT FOUND - File doesn't exist`);
      } else {
        console.log(`      ⚠️  ${result.status} - ${result.statusText}`);
      }
    });
  });
  
  // Overall summary
  const totalSuccess = results.filter(r => r.status === 200).length;
  const totalErrors = results.length - totalSuccess;
  
  console.log('\n📊 Overall Summary:');
  console.log(`   ✅ Success: ${totalSuccess}`);
  console.log(`   ❌ Errors:  ${totalErrors}`);
  console.log(`   📈 Total:   ${results.length}`);
  
  provideRecommendations(categories);
  
  return { 
    totalSuccess, 
    totalErrors, 
    total: results.length,
    categories 
  };
};

// CLI interface
if (require.main === module) {
  testCdnStatus().catch(console.error);
}

module.exports = { testCdnStatus };
