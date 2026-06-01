import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';
import { getMediumArticles } from '@/lib/medium';

export const metadata = {
  title: 'Articles | Edmond A Porter',
  description: 'Latest articles and thoughts from Edmond A Porter on writing, creativity, and the stories behind the stories.',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Articles | Edmond A Porter',
    description: 'Latest articles and thoughts on writing, creativity, and storytelling.',
    url: '/articles',
    siteName: 'Edmond A Porter',
    type: 'website',
    images: ['/images/Edmond_Headshot.webp'],
  },
};

export default async function ArticlesPage() {
  const articles = await getMediumArticles();
  
  return (
    <>
      <Navigation />
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
          <p className="text-lg text-on-surface-variant">
            Thoughts on writing, creativity, and the stories behind the stories.
            All articles originally published on Medium.
          </p>
        </header>

        {/* Featured Collections */}
        <section aria-labelledby="collections-heading" className="mb-12">
          <h2 id="collections-heading" className="text-sm uppercase tracking-wider font-bold text-on-surface-variant mb-4">
            Collections
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/the-hard-land"
              className="group block bg-surface-container rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-secondary"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-secondary">
                  Serial novel
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">
                  arrow_forward
                </span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                The Hard Land
              </h3>
              <p className="text-on-surface-variant">
                A 33-part serial novel of love and survival in the early 20th-century American West. Start at Part 1 and follow the story chapter by chapter.
              </p>
            </Link>

            <Link
              href="/short-stories"
              className="group block bg-surface-container rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-secondary"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-secondary">
                  Short stories & essays
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">
                  arrow_forward
                </span>
              </div>
              <h3 className="font-headline text-2xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                Short Stories
              </h3>
              <p className="text-on-surface-variant">
                Standalone short stories and creative nonfiction — including <em>The MaGee House</em>, <em>The C-Word</em>, and more.
              </p>
            </Link>
          </div>
        </section>

        {/* Articles Grid */}
        <h2 className="text-sm uppercase tracking-wider font-bold text-on-surface-variant mb-4">
          All articles
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <article 
                key={index} 
                className="bg-surface-container rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {article.thumbnail && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      width={400}
                      height={225}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="font-headline text-xl font-bold text-primary mb-3 line-clamp-2">
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
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
                    className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors"
                  >
                    Read {article.title}
                    <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                  </Link>
                </div>
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
    <Footer />
  </>
  );
}
