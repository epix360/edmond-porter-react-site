import fs from 'fs';
import path from 'path';

// Read every book JSON from the content directory so books added via the CMS
// appear automatically. Display order is handled by sortBooks below; the
// alphabetical filename read here only acts as a stable tiebreaker.
const booksDir = path.join(process.cwd(), 'public/content/books');

export const allBooks = fs
  .readdirSync(booksDir)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .map((file) => JSON.parse(fs.readFileSync(path.join(booksDir, file), 'utf8')))
  .filter((book) => book.slug);

export function sortBooks(books) {
  return [...books].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    const dateA = a.releaseDate ? new Date(a.releaseDate) : null;
    const dateB = b.releaseDate ? new Date(b.releaseDate) : null;

    if (dateA && dateB) return dateB - dateA;
    if (dateA) return -1;
    if (dateB) return 1;
    return 0;
  });
}

export function groupByAuthorship(books) {
  return {
    author: books.filter((b) => b.authorship === 'author'),
    contributor: books.filter((b) => b.authorship !== 'author'),
  };
}

// Book ItemList JSON-LD shared by every page that renders the full bookshelf
// (home, about). Single source so the Product items always carry the fields
// Google Merchant listings require (name, image, offers) on every page.
export function getBookListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: sortBooks(allBooks).map((book, index) => {
      const canonicalUrl = `https://edmondaporter.com/books/${book.slug}`;
      const hasReleaseDate = book.releaseDate && book.releaseDate.trim() !== '';
      const availability = hasReleaseDate && new Date(book.releaseDate) > new Date()
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock';
      return {
        '@type': ['Book', 'Product'],
        '@id': canonicalUrl,
        position: index + 1,
        name: book.title,
        description: book.description,
        image: `https://edmondaporter.com/images/${book.image.replace(/^\//, '')}`,
        url: canonicalUrl,
        author: {
          '@type': 'Person',
          name: 'Edmond A Porter',
          url: 'https://edmondaporter.com',
        },
        offers: book.formats
          ? book.formats.map((f) => ({
              '@type': 'Offer',
              ...(f.amazonUrl && { url: f.amazonUrl }),
              price: f.price,
              priceCurrency: 'USD',
              availability,
            }))
          : {
              '@type': 'Offer',
              url: book.amazonUrl,
              priceCurrency: 'USD',
              availability,
            },
      };
    }),
  };
}
