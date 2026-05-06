import turbulentWaters from '@/public/content/books/turbulent-waters.json';
import theSeasonsThatMadeMe from '@/public/content/books/the-seasons-that-made-me.json';
import luckyPenny from '@/public/content/books/lucky-penny.json';
import faithfulHearts from '@/public/content/books/faithful-hearts.json';
import wanderlust from '@/public/content/books/wanderlust.json';
import theWorkAndTheStories from '@/public/content/books/the-work-and-the-stories.json';
import utahsBestPoetryAndProse from '@/public/content/books/utahs-best-poetry-and-prose.json';

export const allBooks = [
  turbulentWaters,
  theSeasonsThatMadeMe,
  luckyPenny,
  faithfulHearts,
  wanderlust,
  theWorkAndTheStories,
  utahsBestPoetryAndProse,
];

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
