import React, { useState, useEffect } from 'react';

const MediumFeed = ({ mediumContent }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Using CMS data instead of hardcoded content
        const loadMediumContent = async () => {
            try {
                setLoading(true);
                
                // Load medium-section content from CMS
                const response = await fetch('/edmond-porter-react-site/content/medium-section.json');
                if (!response.ok) throw new Error(`Failed to load medium-section content: ${response.status}`);
                const data = await response.json();
                
                // For now, keep existing Medium RSS feed logic for post previews
                // In the future, posts can be managed through CMS
                fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@eporter609')
                    .then(res => res.json())
                    .then(rssData => {
                        if (rssData.status === 'ok') {
                            // Process posts to extract images from content
                            const processedPosts = rssData.items.slice(0, 3).map(post => {
                                // Extract image from post content or description
                                const content = post.content || post.description || '';
                                const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
                                const thumbnail = imgMatch ? imgMatch[1] : null;
                                
                                return {
                                    title: post.title,
                                    link: post.link,
                                    thumbnail,
                                    description: post.description
                                };
                            });
                            
                            setPosts(processedPosts);
                        } else {
                            console.error('Medium feed error:', rssData);
                        }
                    })
                    .catch(error => {
                        console.error('Medium RSS fetch error:', error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                    
            } catch (error) {
                console.error('Medium content loading error:', error);
                setLoading(false);
            }
        };

        loadMediumContent();
    }, []);

    if (loading) return <div className="py-20 text-center font-label text-slate-500">Loading latest stories...</div>;
    if (posts.length === 0) return null;

    return (
        <section className="py-24 bg-surface-bright" id="medium">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="font-label text-secondary uppercase tracking-widest text-sm font-bold mb-4 block">On Medium</span>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-6">{mediumContent?.headline || 'Latest Musings & Essays'}</h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto">{mediumContent?.description || 'Occasional thoughts on the craft of writing, historical echoes, and the creative life.'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <a key={i} href={post.link} target="_blank" rel="noopener noreferrer" className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                            <div className="aspect-video overflow-hidden bg-slate-100 relative">
                                <img 
                                    src={post.thumbnail} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800';
                                    }}
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center text-xs font-label text-secondary font-bold uppercase tracking-wider mb-4">
                                    <span className="material-symbols-outlined text-sm mr-1">calendar_today</span>
                                    {new Date(post.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h3 className="font-headline text-xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <div className="mt-auto pt-6 flex items-center text-primary font-bold text-sm">
                                    Read Story
                                    <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <a href="https://medium.com/@eporter609" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg font-label font-bold hover:bg-primary-container transition-colors">
                        <span>Follow on Medium</span>
                        <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default MediumFeed;
