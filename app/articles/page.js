import { getMediumArticles } from '@/lib/medium';
import Link from 'next/link';

export const metadata = {
  title: 'Articles | Edmond A Porter',
  description: 'Latest articles and thoughts from Edmond A Porter on writing, creativity, and the stories behind the stories.',
  openGraph: {
    title: 'Articles | Edmond A Porter',
    description: 'Latest articles and thoughts on writing, creativity, and storytelling.',
  },
};

export default async function ArticlesPage() {
  const articles = await getMediumArticles();
  
  return (
    <main className="min-h-screen py-12 pt-24 bg-surface-container-lowest">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-8"
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Home
        </Link>
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline mb-4">
            Latest Articles
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Thoughts on writing, creativity, and the stories behind the stories. 
            All articles originally published on Medium.
          </p>
        </header>
        
        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <article 
                key={index} 
                className="bg-surface-container rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                {article.thumbnail && (
                  <div className="h-48 overflow-hidden">
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
                  <h2 className="font-headline text-xl font-bold text-primary mb-3 line-clamp-2">
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
                  {/* Date */}
                  {article.formattedDate && (
                    <time className="text-sm text-on-surface-variant mb-3 block">
                      {article.formattedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  )}
                  
                  {/* Description */}
                  <p className="text-on-surface-variant line-clamp-3 mb-4">
                    {article.description}
                  </p>
                  
                  {/* Read More Link */}
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors"
                  >
                    Read Article
                    <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-on-surface-variant">
                No articles available at the moment. Please check back later.
              </p>
            </div>
          )}
        </div>
        
        {/* Footer Link to Medium */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-on-surface-variant mb-4">
            Want to see more?
          </p>
          <a
            href="https://medium.com/@eporter609"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors"
          >
            View all articles on Medium
            <span className="material-symbols-outlined ml-1">open_in_new</span>
          </a>
        </div>
      </div>
    </main>
  );
}
