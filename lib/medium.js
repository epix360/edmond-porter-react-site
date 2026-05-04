// Medium RSS feed utility using rss-parser
import Parser from 'rss-parser';

// Format date from RSS feed
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Strip HTML tags from content
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<\/p>/gi, '\n').replace(/<[^>]*>/g, '').trim();
};

// Create URL-safe slug from title
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100);
};

// Create excerpt from content (minimum 250 words, complete paragraphs)
const createExcerpt = (content, minWords = 250) => {
  if (!content) return '';

  // Remove heading tags (h1, h2, h3, h4)
  let filteredContent = content.replace(/<h[1-4][^>]*>.*?<\/h[1-4]>/gi, '');
  // Remove figure elements
  filteredContent = filteredContent.replace(/<figure[^>]*>.*?<\/figure>/gi, '');
  // Remove figcaption elements
  filteredContent = filteredContent.replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '');
  // Remove photo credit patterns
  filteredContent = filteredContent.replace(/Photo by.*?<\/p>/gi, '');
  filteredContent = filteredContent.replace(/Image by.*?<\/p>/gi, '');
  filteredContent = filteredContent.replace(/Credit:.*?<\/p>/gi, '');

  const plainText = stripHtml(filteredContent);
  const paragraphs = plainText.split(/\n+/).filter(p => p.trim().length > 0);

  // Skip first paragraph if it's short (likely a subtitle)
  let startIndex = 0;
  if (paragraphs.length > 1 && paragraphs[0].trim().length < 100) {
    startIndex = 1;
  }

  const contentParagraphs = paragraphs.slice(startIndex);

  // Accumulate paragraphs until we reach minimum word count
  let selectedParagraphs = [];
  let wordCount = 0;

  for (const paragraph of contentParagraphs) {
    const cleanParagraph = paragraph.trim();
    if (!cleanParagraph) continue;
    if (cleanParagraph.length < 30) continue; // Skip very short lines
    if (/^(Photo|Image|Credit|Photo by|Image by|Source:|Via)/i.test(cleanParagraph)) continue;

    const words = cleanParagraph.split(/\s+/).filter(w => w.length > 0);

    selectedParagraphs.push(cleanParagraph);
    wordCount += words.length;

    if (wordCount >= minWords) {
      break;
    }
  }

  if (selectedParagraphs.length === 0) {
    return 'Read the full article on Medium...';
  }

  return selectedParagraphs.join('\n\n');
};

// Extract thumbnail from content
const extractThumbnail = (content) => {
  if (!content) return null;
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  return imgMatch ? imgMatch[1] : null;
};

// Extract first three paragraphs from content
const extractFirstThreeParagraphs = (content) => {
  if (!content) return [];
  
  // Remove heading tags, figures, figcaptions first
  let filteredContent = content.replace(/<h[1-4][^>]*>.*?<\/h[1-4]>/gi, '');
  filteredContent = filteredContent.replace(/<figure[^>]*>.*?<\/figure>/gi, '');
  filteredContent = filteredContent.replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '');
  filteredContent = filteredContent.replace(/Photo by.*?<\/p>/gi, '');
  filteredContent = filteredContent.replace(/Image by.*?<\/p>/gi, '');
  filteredContent = filteredContent.replace(/Credit:.*?<\/p>/gi, '');
  
  const plainText = stripHtml(filteredContent);
  const paragraphs = plainText.split(/\n+/).filter(p => p.trim().length > 0);
  
  // Skip first paragraph if it's short (likely a subtitle)
  let startIndex = 0;
  if (paragraphs.length > 1 && paragraphs[0].trim().length < 100) {
    startIndex = 1;
  }
  
  // Return first 3 content paragraphs
  return paragraphs.slice(startIndex, startIndex + 3);
};

// Main function to fetch and parse Medium articles
export async function getMediumArticles() {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://medium.com/feed/@eporter609');
    
    return feed.items.map(item => {
      const content = item['content:encoded'] || item.content || item.contentSnippet || '';
      const title = item.title || 'Untitled Article';
      
      return {
        title: title,
        link: item.link,
        slug: createSlug(title),
        pubDate: item.pubDate,
        formattedDate: formatDate(item.pubDate),
        description: createExcerpt(content),
        firstThreeParagraphs: extractFirstThreeParagraphs(content),
        thumbnail: extractThumbnail(content),
        content: content
      };
    });
  } catch (error) {
    console.error('Medium feed error:', error);
    return [];
  }
}

// Get a single article by slug
export async function getArticleBySlug(slug) {
  const articles = await getMediumArticles();
  return articles.find(article => article.slug === slug) || null;
}
