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
