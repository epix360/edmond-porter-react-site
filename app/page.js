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
      
      {/* Server-side Medium feed - baked into static HTML */}
      <ServerMediumFeed />
      
      {/* Contact section */}
      <HomePageBottom />
    </>
  );
}
