import { getMediumArticles } from '@/lib/medium';
import Link from 'next/link';

export default async function HomeMediumSection() {
  const articles = await getMediumArticles();
  const recentArticles = articles.slice(0, 3); // Get top 3 most recent posts
  
  return (
    <section className="py-12 bg-surface-container-lowest" id="medium">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
          Latest from Medium
        </h2>
        <p className="text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
          Read my latest thoughts on writing, creativity, and the stories behind the stories.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {recentArticles.length > 0 ? (
            recentArticles.map((article, index) => (
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
                    {article.formattedDate.toLocaleDateString('en-US', { 
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
          <Link 
            href="/articles"
            className="inline-flex items-center bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg"
          >
            View All Articles
            <span className="material-symbols-outlined ml-2">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
