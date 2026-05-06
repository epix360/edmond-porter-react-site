// Fetches the Medium RSS feed once per build and writes a snapshot to
// lib/medium-snapshot.json. The Next.js build reads from that snapshot
// instead of hitting Medium from each of its parallel workers — that
// fan-out was tripping Medium's rate limit and 403'ing builds.
//
// On fetch failure, the existing snapshot is left in place so the build
// stays green; the snapshot is committed for exactly that reason.
//
// Run via `npm run fetch:medium` or as part of `prebuild`.

const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const FEED_URL = 'https://medium.com/feed/@eporter609';
const SNAPSHOT_PATH = path.join(__dirname, '..', 'lib', 'medium-snapshot.json');
const USER_AGENT =
  'Mozilla/5.0 (compatible; EdmondPorterSite/1.0; +https://edmondaporter.com)';
const ATTEMPTS = 3;

async function fetchWithRetry(parser, url) {
  let lastErr;
  for (let i = 0; i < ATTEMPTS; i++) {
    try {
      return await parser.parseURL(url);
    } catch (err) {
      lastErr = err;
      if (i < ATTEMPTS - 1) {
        const delay = 1000 * Math.pow(2, i);
        console.log(`  retry ${i + 1}/${ATTEMPTS - 1} in ${delay}ms (${err.message})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastErr;
}

(async () => {
  console.log('Fetching Medium feed...');

  const parser = new Parser({
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/xml; q=0.9, */*; q=0.8',
    },
    customFields: {
      item: ['content:encoded', 'pubDate'],
    },
  });

  try {
    const feed = await fetchWithRetry(parser, FEED_URL);

    if (!feed.items || feed.items.length === 0) {
      throw new Error('feed returned no items');
    }

    const articles = feed.items.map((item) => ({
      title: item.title || 'Untitled Article',
      link: item.link,
      pubDate: item.pubDate,
      content: item['content:encoded'] || item.content || item.contentSnippet || '',
    }));

    fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(articles, null, 2) + '\n');
    console.log(
      `✓ Wrote ${articles.length} articles to ${path.relative(process.cwd(), SNAPSHOT_PATH)}`
    );
  } catch (err) {
    if (fs.existsSync(SNAPSHOT_PATH)) {
      console.warn(
        `⚠ Medium fetch failed (${err.message}). Keeping existing snapshot at ${path.relative(process.cwd(), SNAPSHOT_PATH)}.`
      );
    } else {
      console.error(
        `✗ Medium fetch failed and no snapshot exists: ${err.message}`
      );
      console.error('  Build will continue but /articles routes will be empty.');
    }
  }
})();
