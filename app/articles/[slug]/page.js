import { getMediumArticles, getArticleBySlug, getRecommendedArticles } from '@/lib/medium';
import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';

// Generate static paths for all articles
export async function generateStaticParams() {
  const articles = await getMediumArticles();
  return articles.map(article => ({
    slug: article.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found | Edmond A Porter',
    };
  }
  
  return {
    title: `${article.title} | Edmond A Porter`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.thumbnail ? [article.thumbnail] : [],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const recommendedArticles = await getRecommendedArticles(slug, 2);
  
  if (!article) {
    return (
      <main className="min-h-screen py-12 pt-24 bg-surface-container-lowest">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-primary font-headline mb-4">
            Article Not Found
          </h1>
          <Link
            href="/articles"
            className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors"
          >
            <span className="material-symbols-outlined mr-1">arrow_back</span>
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }
  
  // Create BlogPosting structured data
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    url: `https://edmondaporter.com/articles/${slug}`,
    datePublished: article.pubDate,
    author: {
      '@type': 'Person',
      name: 'Edmond A Porter',
      url: 'https://edmondaporter.com'
    },
    publisher: {
      '@type': 'Person',
      name: 'Edmond A Porter',
      url: 'https://edmondaporter.com'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://edmondaporter.com/articles/${slug}`
    },
    ...(article.thumbnail && {
      image: {
        '@type': 'ImageObject',
        url: article.thumbnail
      }
    })
  };
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen py-12 pt-24 bg-surface-container-lowest">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Link */}
        <Link
          href="/articles"
          className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-8"
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Articles
        </Link>
        
        {/* Article Header */}
        <article>
          {/* Thumbnail */}
          {article.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline mb-4">
            {article.title}
          </h1>
          
          {/* Date */}
          {article.formattedDate && (
            <time className="text-sm text-on-surface-variant mb-6 block">
              Published on {article.formattedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          
          {/* Article Preview */}
          {article.description && (
            <div className="mb-8 space-y-4">
              {article.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg text-on-surface-variant leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          
          {/* CTA Button - Outlined Style */}
          <div className="border-t border-slate-200 pt-8">
            <p className="text-on-surface-variant mb-4">
              Read the full article on Medium:
            </p>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center py-3 px-6 border-2 border-secondary text-secondary font-bold uppercase tracking-widest rounded-lg bg-transparent hover:bg-secondary hover:text-white transition-colors duration-300"
            >
              Read on Medium
              <span className="material-symbols-outlined ml-2">open_in_new</span>
            </a>
          </div>

          {/* Read Next Section */}
          {recommendedArticles.length > 0 && (
            <>
              <hr className="my-12 border-slate-200" />
              <section>
                <h3 className="text-2xl font-headline font-bold text-primary mb-6">Read Next</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {recommendedArticles.map((recArticle) => (
                    <Link
                      href={`/articles/${recArticle.slug}`}
                      key={recArticle.slug}
                      className="group flex flex-col gap-3"
                    >
                      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-surface-container">
                        {recArticle.thumbnail ? (
                          <img
                            src={recArticle.thumbnail}
                            alt={recArticle.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400 text-4xl">article</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                        {recArticle.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </article>
      </div>
    </main>
    <Footer />
  </>
  );
}
