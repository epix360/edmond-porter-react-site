#!/usr/bin/env node

// Submits all site URLs to Bing via IndexNow.
// Run after a deploy: node scripts/indexnow-submit.js
// Or with a specific URL: node scripts/indexnow-submit.js https://edmondaporter.com/books/some-book

const BASE_URL = 'https://edmondaporter.com';
const KEY = '0c43f637b4574fb086746aac755c29aa';
const KEY_LOCATION = `${BASE_URL}/${KEY}.txt`;

const STATIC_URLS = [
  BASE_URL,
  `${BASE_URL}/about`,
  `${BASE_URL}/articles`,
  `${BASE_URL}/books`,
  `${BASE_URL}/links`,
  `${BASE_URL}/publications`,
];

async function fetchSitemapUrls() {
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
    const xml = await res.text();
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    return [...matches].map(m => m[1]);
  } catch (err) {
    console.warn('Could not fetch live sitemap, using static URL list:', err.message);
    return null;
  }
}

async function submit(urls) {
  const body = {
    host: new URL(BASE_URL).hostname,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URL(s) to Bing IndexNow...`);

  const res = await fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`Success: ${res.status}`);
  } else {
    const text = await res.text();
    console.error(`Failed: ${res.status}`, text);
    process.exit(1);
  }
}

async function main() {
  const specificUrl = process.argv[2];

  if (specificUrl) {
    await submit([specificUrl]);
    return;
  }

  const sitemapUrls = await fetchSitemapUrls();
  const urls = sitemapUrls ?? STATIC_URLS;
  await submit(urls);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
