import HomePageTop from './components/HomePageTop';
import HomePageBottom from './components/HomePageBottom';
import { getMediumArticles } from '@/lib/medium';
import Link from 'next/link';
import { fallbackContent } from '@/src/data/fallbackContent';

export const metadata = {
  title: 'Home | Edmond A Porter',
  description: 'Edmond A Porter - Contemporary author exploring human experience through compelling narratives and thoughtful prose.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Edmond A Porter',
    description: 'Contemporary author exploring human experience through compelling narratives.',
    images: ['/images/Edmond_Headshot.webp'],
  },
};

// Book Collection JSON-LD Structured Data
const bookSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: fallbackContent.books.map((book, index) => ({
    '@type': 'Book',
    '@id': book.buyLink,
    position: book.order,
    name: book.title,
    description: book.description,
    image: `https://edmondaporter.com/images/${book.cover.replace(/^\//, '')}`,
    author: {
      '@type': 'Person',
      name: 'Edmond A Porter',
      url: 'https://edmondaporter.com'
    },
    offers: {
      '@type': 'Offer',
      url: book.buyLink,
      availability: 'https://schema.org/InStock'
    }
  }))
};

// This is a Server Component - fetches at build time
export default async function HomePage() {
  const articles = await getMediumArticles();
  const recentArticles = articles.slice(0, 3);
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchemaData) }}
      />
      
      {/* Hero + About + Books sections */}
      <HomePageTop />
      
      {/* Articles section - links to local /articles routes */}
      <section className="py-12 bg-surface-container-lowest" id="medium">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
            Latest from Medium
          </h2>
          <p className="text-center text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Read my latest thoughts on writing, creativity, and the stories behind the stories.
          </p>
          
          {/* Articles Grid */}
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
                    className="inline-flex items-center text-secondary font-bold group"
                  >
                    <span className="hover:underline">Read More</span>
                    <span className="material-symbols-outlined ml-1 text-sm no-underline">arrow_forward</span>
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
            <a 
              href="/articles"
              className="inline-flex items-center bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#96643c] transition-colors shadow-lg"
            >
              View All Articles
              <span className="material-symbols-outlined ml-2">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
      
      {/* Contact section */}
      <HomePageBottom />
    </>
  );
}
