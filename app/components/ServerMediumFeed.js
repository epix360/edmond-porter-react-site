// Server-side Medium Feed component using direct RSS parsing
import Parser from 'rss-parser';

// Utility functions for formatting and excerpt creation
const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

const stripHtml = (html) => {
    if (!html) return '';
    // Replace </p> with newlines to preserve paragraph breaks
    return html.replace(/<\/p>/gi, '\n').replace(/<[^>]*>/g, '').trim();
};

const createExcerpt = (content, maxLength = 150) => {
    if (!content) return '';
    
    // Remove heading tags (h1, h2, h3, h4) - these are subtitles on Medium
    let filteredContent = content.replace(/<h[1-4][^>]*>.*?<\/h[1-4]>/gi, '');
    // Remove figure elements (photos with captions/credits)
    filteredContent = filteredContent.replace(/<figure[^>]*>.*?<\/figure>/gi, '');
    // Remove figcaption elements
    filteredContent = filteredContent.replace(/<figcaption[^>]*>.*?<\/figcaption>/gi, '');
    // Remove photo credit patterns
    filteredContent = filteredContent.replace(/Photo by.*?<\/p>/gi, '');
    filteredContent = filteredContent.replace(/Image by.*?<\/p>/gi, '');
    filteredContent = filteredContent.replace(/Credit:.*?<\/p>/gi, '');
    
    // Get plain text (paragraphs are now separated by newlines)
    const plainText = stripHtml(filteredContent);
    
    // Split by newlines to get paragraphs
    const paragraphs = plainText.split(/\n+/).filter(p => p.trim().length > 0);
    
    // Simple approach: if there are multiple paragraphs, skip the first one
    // (it's usually a subtitle like "Preventing the rewriting of history")
    let startIndex = 0;
    if (paragraphs.length > 1 && paragraphs[0].trim().length < 100) {
        startIndex = 1;
    }
    
    // Get paragraphs starting from content (skipping subtitle)
    const contentParagraphs = paragraphs.slice(startIndex);
    
    // Join with proper spacing
    const contentText = contentParagraphs.join('. ');
    
    // Split into sentences and build excerpt
    const sentences = contentText.split(/[.!?]+/);
    let excerpt = '';
    
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        
        // Skip empty sentences
        if (!trimmedSentence) continue;
        
        // Skip very short sentences (likely fragments)
        if (trimmedSentence.length < 20) continue;
        
        // Skip sentences that look like photo credits
        if (/^(Photo|Image|Credit|Photo by|Image by|Source:|Via)/i.test(trimmedSentence)) continue;
        
        if (trimmedSentence && (excerpt.length + trimmedSentence.length + 2) <= maxLength) {
            excerpt += (excerpt ? '. ' : '') + trimmedSentence;
        } else if (trimmedSentence && !excerpt) {
            excerpt = trimmedSentence.substring(0, maxLength - 3) + '...';
            break;
        } else {
            break;
        }
    }
    
    return excerpt || 'Read the full article on Medium...';
};

// Extract thumbnail from content
const extractThumbnail = (content) => {
    if (!content) return null;
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
    return imgMatch ? imgMatch[1] : null;
};

// Server Medium Feed Component - fetches RSS directly
export default async function ServerMediumFeed({ mediumContent }) {
    try {
        const parser = new Parser();
        const feed = await parser.parseURL('https://medium.com/feed/@eporter609');
        
        // Process the first 3 items
        const processedPosts = feed.items.slice(0, 3).map(item => {
            const content = item['content:encoded'] || item.content || item.contentSnippet || '';
            
            return {
                title: item.title,
                link: item.link,
                thumbnail: extractThumbnail(content),
                formattedDate: formatDate(item.pubDate),
                plainDescription: createExcerpt(content)
            };
        });
        
        return (
            <section className="py-12 bg-surface-container-lowest" id="medium">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                        {mediumContent?.headline || "Latest from Medium"}
                    </h2>
                    <p className="text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
                        {mediumContent?.subheading || "Read my latest thoughts on writing, creativity, and the stories behind the stories."}
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {processedPosts.length > 0 ? (
                            processedPosts.map((post, index) => (
                                <article key={index} className="bg-surface-container rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                    {post.thumbnail && (
                                        <div className="mb-4 overflow-hidden rounded-lg">
                                            <img 
                                                src={post.thumbnail} 
                                                alt={post.title}
                                                className="w-full h-48 object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <h3 className="font-headline text-xl font-bold text-primary mb-3 line-clamp-2">
                                        <a 
                                            href={post.link} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:text-secondary transition-colors"
                                        >
                                            {post.title}
                                        </a>
                                    </h3>
                                    {post.formattedDate && (
                                        <time className="text-sm text-on-surface-variant mb-3 block">
                                            {post.formattedDate.toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </time>
                                    )}
                                    <p className="text-on-surface-variant line-clamp-3 mb-4">
                                        {post.plainDescription}
                                    </p>
                                    <a 
                                        href={post.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-secondary font-bold hover:underline"
                                    >
                                        Read More 
                                        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                                    </a>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-on-surface-variant">
                                    No articles available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center mt-12">
                        <a 
                            href="https://medium.com/@eporter609" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg"
                        >
                            View All Articles
                            <span className="material-symbols-outlined ml-2">arrow_forward</span>
                        </a>
                    </div>
                </div>
            </section>
        );
    } catch (error) {
        console.error('Medium feed error:', error);
        
        // Graceful fallback UI
        return (
            <section className="py-12 bg-surface-container-lowest" id="medium">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8">
                        {mediumContent?.headline || "Latest from Medium"}
                    </h2>
                    <p className="text-on-surface-variant mb-8">
                        Read my latest articles directly on{' '}
                        <a 
                            href="https://medium.com/@eporter609" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-secondary font-bold hover:underline"
                        >
                            Medium
                        </a>
                        .
                    </p>
                    <a 
                        href="https://medium.com/@eporter609" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg"
                    >
                        View All Articles
                        <span className="material-symbols-outlined ml-2">arrow_forward</span>
                    </a>
                </div>
            </section>
        );
    }
}
