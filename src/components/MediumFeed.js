import React, { useState, useEffect } from 'react';

const MediumFeed = ({ mediumContent }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Date validation helper
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    useEffect(() => {
        const loadMediumFeed = () => {
            setLoading(true);
            setError(null);
            
            fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@eporter609')
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.status === 'ok') {
                        // Process posts to extract images from content
                        const processedPosts = data.items.slice(0, 3).map(post => {
                            // Extract image from post content or description
                            const content = post.content || post.description || '';
                            const imgMatch = content.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
                            const thumbnail = imgMatch ? imgMatch[1] : null;
                            
                            return {
                                ...post,
                                thumbnail,
                                formattedDate: formatDate(post.pubDate)
                            };
                        });
                        setPosts(processedPosts);
                    } else {
                        throw new Error(data.message || 'Failed to load Medium feed');
                    }
                })
                .catch(error => {
                    console.warn('Medium feed loading failed:', error);
                    setError(error.message);
                    setPosts([]); // Clear posts on error
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        // Load immediately without delay
        loadMediumFeed();
    }, []);

    if (loading) {
        return (
            <section className="py-12 bg-surface-container-lowest" id="medium">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                        {mediumContent?.headline || "Latest from Medium"}
                    </h2>
                    <p className="text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
                        {mediumContent?.subheading || "Read my latest thoughts on writing, creativity, and the stories behind the stories."}
                    </p>
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-surface-container-lowest" id="medium">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
                    {mediumContent?.headline || "Latest from Medium"}
                </h2>
                <p className="text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
                    {mediumContent?.subheading || "Read my latest thoughts on writing, creativity, and the stories behind the stories."}
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <article key={index} className="bg-surface-container rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                {post.thumbnail && (
                                    <div className="mb-4 overflow-hidden rounded-lg">
                                        <img 
                                            src={post.thumbnail} 
                                            alt={post.title}
                                            className="w-full h-48 object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
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
                                    {post.description}
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
                                {error ? "Unable to load articles at the moment." : "No articles available at the moment."}
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
};

export default MediumFeed;
