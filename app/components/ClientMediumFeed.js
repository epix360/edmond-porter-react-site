'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Parser from 'rss-parser';

// Create URL-safe slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
};

// Strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/p>/gi, '\n').replace(/<[^>]*>/g, '').trim();
};

// Create excerpt (250+ words)
const createExcerpt = (content) => {
  if (!content) return '';
  
  let filtered = content.replace(/<h[1-4][^>]*>.*?<\/h[1-4]>/gi, '');
  filtered = filtered.replace(/<figure[^>]*>.*?<\/figure>/gi, '');
  filtered = filtered.replace(/Photo by.*?<\/p>/gi, '');
  
  const plainText = stripHtml(filtered);
  const paragraphs = plainText.split(/\n+/).filter(p => p.trim().length > 0);
  
  let startIndex = 0;
  if (paragraphs.length > 1 && paragraphs[0].trim().length < 100) {
    startIndex = 1;
  }
  
  const contentParagraphs = paragraphs.slice(startIndex);
  let selected = [];
  let wordCount = 0;
  
  for (const para of contentParagraphs) {
    const clean = para.trim();
    if (!clean || clean.length < 30) continue;
    if (/^(Photo|Image|Credit)/i.test(clean)) continue;
    
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    selected.push(clean);
    wordCount += words.length;
    
    if (wordCount >= 250) break;
  }
  
  return selected.join('\n\n') || 'Read the full article on Medium...';
};

// Extract thumbnail
const extractThumbnail = (content) => {
  if (!content) return null;
  const match = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  return match ? match[1] : null;
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export default function ClientMediumFeed({ limit = 3 }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Use CORS proxy or fetch directly if allowed
        const response = await fetch('https://medium.com/feed/@eporter609', {
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const xmlText = await response.text();
        
        // Simple XML parsing
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        const parsedArticles = Array.from(items).slice(0, limit).map(item => {
          const title = item.querySelector('title')?.textContent || 'Untitled';
          const link = item.querySelector('link')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent;
          const contentEncoded = item.querySelector('content\\:encoded')?.textContent || 
                                item.querySelector('encoded')?.textContent || '';
          
          return {
            title,
            link,
            slug: createSlug(title),
            pubDate,
            formattedDate: formatDate(pubDate),
            description: createExcerpt(contentEncoded),
            thumbnail: extractThumbnail(contentEncoded),
          };
        });
        
        setArticles(parsedArticles);
      } catch (err) {
        console.error('Feed error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-surface-container rounded-lg p-6 shadow-lg animate-pulse">
            <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">
          Unable to load articles. Please try again later.
        </p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-on-surface-variant">
          No articles available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <article key={index} className="bg-surface-container rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {article.thumbnail && (
            <div className="mb-4 overflow-hidden rounded-lg">
              <img 
                src={article.thumbnail} 
                alt={article.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            </div>
          )}
          <h3 className="font-headline text-xl font-bold text-primary mb-3 line-clamp-2">
            <Link 
              href={`/articles/${article.slug}`}
              className="hover:text-secondary transition-colors"
            >
              {article.title}
            </Link>
          </h3>
          {article.formattedDate && (
            <time className="text-sm text-on-surface-variant mb-3 block">
              {new Date(article.formattedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          )}
          <p className="text-on-surface-variant line-clamp-3 mb-4">
            {article.description}
          </p>
          <Link 
            href={`/articles/${article.slug}`}
            className="inline-flex items-center text-secondary font-bold hover:underline"
          >
            Read More 
            <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
          </Link>
        </article>
      ))}
    </div>
  );
}
