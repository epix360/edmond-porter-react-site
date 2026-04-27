import { Suspense } from 'react';
import HomePageTop from './components/HomePageTop';
import HomePageBottom from './components/HomePageBottom';
import ServerMediumFeed from './components/ServerMediumFeed';
import { fallbackContent } from '@/src/data/fallbackContent';

export const metadata = {
  title: 'Home | Edmond A Porter',
  description: 'Edmond A Porter - Contemporary author exploring human experience through compelling narratives and thoughtful prose.',
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
    image: `https://edmondaporter.com/images/${book.cover}`,
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

// This is a Server Component
export default function HomePage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchemaData) }}
      />
      
      {/* Hero + About + Books sections */}
      <HomePageTop />
      
      {/* Server-side Medium feed with Suspense */}
      <Suspense fallback={
        <section className="py-12 bg-surface-container-lowest" id="medium">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </section>
      }>
        <ServerMediumFeed />
      </Suspense>
      
      {/* Contact section */}
      <HomePageBottom />
    </>
  );
}
