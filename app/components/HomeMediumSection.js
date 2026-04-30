import { getMediumArticles } from '@/lib/medium';
import Link from 'next/link';

export default async function HomeMediumSection() {
  const articles = await getMediumArticles();
  const recentArticles = articles.slice(0, 3); // Get top 3 most recent posts
  
  return (
    <section id="articles" className="py-20 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-4">
            Latest Thoughts
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Thoughts on writing, creativity, and the stories behind the stories.
          </p>
        </header>
        
        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {recentArticles.length > 0 ? (
            recentArticles.map((article, index) => (
              <article 
                key={index} 
                className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                {article.thumbnail && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Title */}
                  <h3 className="font-headline text-lg font-bold text-primary mb-2 line-clamp-2">
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  
                  {/* Date */}
                  {article.formattedDate && (
                    <time className="text-sm text-on-surface-variant mb-3 block">
                      {article.formattedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  
                  {/* Description */}
                  <p className="text-on-surface-variant text-sm line-clamp-3 mb-4">
                    {article.description}
                  </p>
                  
                  {/* Read More Link */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors text-sm"
                  >
                    Read Article
                    <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-on-surface-variant">
                No articles available at the moment.
              </p>
            </div>
          )}
        </div>
        
        {/* View All Link */}
        <div className="text-center">
          <Link
            href="/articles"
            className="inline-flex items-center justify-center py-3 px-6 border-2 border-secondary text-secondary font-bold uppercase tracking-widest rounded-lg bg-transparent hover:bg-secondary hover:text-white transition-colors duration-300"
          >
            View All Articles
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
