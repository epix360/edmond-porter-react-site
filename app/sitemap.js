import { promises as fs } from 'fs';
import path from 'path';
import { getMediumArticles } from '@/lib/medium';

export const dynamic = 'force-static';

const BASE_URL = 'https://edmondaporter.com';

// Recursively scan app directory for page.js files
async function scanAppDirectory(dir, basePath = '') {
  const routes = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);
    
    // Skip special directories and files (including dynamic routes like [slug])
    if (entry.name.startsWith('_') || 
        entry.name.startsWith('(') || 
        entry.name.includes('[') ||
        entry.name === 'api' || 
        entry.name === 'components' ||
        entry.name === 'lib') {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recurse into subdirectories
      const subRoutes = await scanAppDirectory(fullPath, relativePath);
      routes.push(...subRoutes);
    } else if (entry.name === 'page.js' || entry.name === 'page.tsx') {
      // Convert file path to URL route
      let route = basePath.replace(/\\/g, '/');
      
      // Handle root page
      if (route === '') {
        route = '/';
      } else {
        route = '/' + route;
      }
      
      // Determine priority based on route depth and name
      let priority = 0.6;
      let changeFreq = 'monthly';
      
      if (route === '/') {
        priority = 1.0;
        changeFreq = 'weekly';
      } else if (route.split('/').length <= 2) {
        // Top-level pages like /about, /contact
        priority = 0.8;
        changeFreq = 'monthly';
      }
      
      routes.push({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: changeFreq,
        priority: priority,
      });
    }
  }
  
  return routes;
}

export default async function sitemap() {
  // Auto-discover static routes from app directory
  let staticRoutes = [];
  try {
    const appDir = path.join(process.cwd(), 'app');
    staticRoutes = await scanAppDirectory(appDir);
  } catch (error) {
    console.error('Error scanning app directory for sitemap:', error);
    // Fallback to hardcoded routes if scan fails
    staticRoutes = [
      { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
      { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ];
  }

  // Book routes from JSON files
  let bookRoutes = [];
  try {
    const booksDir = path.join(process.cwd(), 'public', 'content', 'books');
    const files = await fs.readdir(booksDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    bookRoutes = jsonFiles.map(file => {
      const slug = file.replace('.json', '');
      return {
        url: `${BASE_URL}/books/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error('Error reading books directory for sitemap:', error);
  }

  // Generic CMS page routes (privacy-policy, terms-of-use, etc.)
  let pageRoutes = [];
  try {
    const pagesDir = path.join(process.cwd(), 'public', 'content', 'pages');
    const files = await fs.readdir(pagesDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    pageRoutes = jsonFiles.map(file => {
      const slug = file.replace('.json', '');
      return {
        url: `${BASE_URL}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      };
    });
  } catch (error) {
    console.error('Error reading pages directory for sitemap:', error);
  }

  // Medium article routes - skip during static build to avoid network issues
  let articleRoutes = [];
  try {
    // Only fetch Medium articles if not in static export build
    if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_EXPORT) {
      const articles = await getMediumArticles();
      articleRoutes = articles.map(article => ({
        url: `${BASE_URL}/articles/${article.slug}`,
        lastModified: article.pubDate ? new Date(article.pubDate) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Error fetching Medium articles for sitemap:', error);
  }

  return [...staticRoutes, ...bookRoutes, ...pageRoutes, ...articleRoutes];
}
