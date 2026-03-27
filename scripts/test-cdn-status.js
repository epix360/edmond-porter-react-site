#!/usr/bin/env node

/**
 * CDN Status Testing Script
 * Tests jsDelivr CDN accessibility and provides status updates
 */

const https = require('https');
const http = require('http');

const testUrls = [
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/images/Turbulent_Waters.webp',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/images/Lucky_Penny.webp',
  'https://cdn.jsdelivr.net/gh/epix360/edmond-porter-react-site@main/images/Edmond_Headshot.webp'
];

const testUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.request(url, { method: 'HEAD', timeout: 10000 }, (response) => {
      resolve({
        url,
        status: response.statusCode,
        statusText: response.statusMessage,
        headers: response.headers
      });
    });

    request.on('error', (error) => {
      resolve({
        url,
        status: 'ERROR',
        statusText: error.message,
        headers: {}
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        statusText: 'Request timeout',
        headers: {}
      });
    });

    request.end();
  });
};

const testCdnStatus = async () => {
  console.log('🔍 Testing jsDelivr CDN Status...\n');
  
  const results = await Promise.all(testUrls.map(testUrl));
  
  let successCount = 0;
  let errorCount = 0;
  
  results.forEach(result => {
    const { url, status, statusText, headers } = result;
    const fileName = url.split('/').pop() || 'root';
    
    console.log(`📁 ${fileName}:`);
    console.log(`   Status: ${status} ${statusText}`);
    
    if (status === 200) {
      successCount++;
      console.log(`   ✅ SUCCESS - CDN accessible`);
      if (headers['content-type']) {
        console.log(`   📄 Type: ${headers['content-type']}`);
      }
      if (headers['cache-control']) {
        console.log(`   💾 Cache: ${headers['cache-control']}`);
      }
    } else if (status === 403) {
      errorCount++;
      console.log(`   ❌ FORBIDDEN - Not indexed yet`);
      console.log(`   ⏰ Need to wait for jsDelivr indexing`);
    } else if (status === 404) {
      errorCount++;
      console.log(`   ❌ NOT FOUND - File doesn't exist`);
    } else {
      errorCount++;
      console.log(`   ⚠️  ${status} - ${statusText}`);
    }
    
    console.log('');
  });
  
  console.log('📊 Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors:  ${errorCount}`);
  console.log(`   📈 Total:   ${results.length}`);
  
  if (successCount === results.length) {
    console.log('\n🎉 CDN is ready! All images are accessible.');
    console.log('💡 You can now re-enable CDN mode in your application.');
  } else if (successCount > 0) {
    console.log('\n⚠️  CDN is partially ready. Some images are accessible.');
    console.log('💡 Consider waiting a bit more for full indexing.');
  } else {
    console.log('\n⏳ CDN is not ready yet. All requests are failing.');
    console.log('💡 Wait 30-60 minutes for jsDelivr to index your repository.');
    console.log('🔧 Keep local mode active until CDN is ready.');
  }
  
  return { successCount, errorCount, total: results.length };
};

// CLI interface
if (require.main === module) {
  testCdnStatus().catch(console.error);
}

module.exports = { testCdnStatus };
