'use client';

import Link from 'next/link';
import { getResponsiveImage } from '@/app/utils/responsiveImage';
import { allBooks, sortBooks, groupByAuthorship } from '@/lib/books';

const yearOf = (date) => {
  if (!date) return null;
  return new Date(date).getUTCFullYear();
};

function BookRow({ book }) {
  const cover = getResponsiveImage(book.image);
  const year = yearOf(book.releaseDate);

  return (
    <li className="flex gap-5 py-5 border-b border-outline-variant">
      <Link
        href={`/books/${book.slug}`}
        className="flex-shrink-0"
        aria-label={book.title}
      >
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes="64px"
          alt={`${book.title} cover`}
          width={64}
          height={96}
          loading="lazy"
          decoding="async"
          className="w-16 h-24 object-cover rounded shadow-md"
        />
      </Link>
      <div className="min-w-0">
        <h3 className="font-headline text-xl font-bold text-primary mb-1">
          <Link
            href={`/books/${book.slug}`}
            className="hover:text-secondary transition-colors"
          >
            {book.title}
          </Link>
        </h3>
        {year && (
          <p className="font-label text-xs uppercase tracking-wider text-secondary mb-2">
            {year}
          </p>
        )}
        <p className="text-on-surface-variant text-sm line-clamp-2">
          {book.description}
        </p>
      </div>
    </li>
  );
}

export default function AboutBookshelf() {
  const groups = groupByAuthorship(sortBooks(allBooks));

  return (
    <section className="pb-16 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-headline text-3xl font-bold text-primary mb-12 text-center">
          The Bookshelf
        </h2>

        {groups.author.length > 0 && (
          <div className="mb-12">
            <h3 className="font-label text-sm uppercase tracking-widest text-secondary font-bold mb-4">
              As Author
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
              {groups.author.map((book) => (
                <BookRow key={book.slug} book={book} />
              ))}
            </ul>
          </div>
        )}

        {groups.contributor.length > 0 && (
          <div>
            <h3 className="font-label text-sm uppercase tracking-widest text-secondary font-bold mb-4">
              Contributing Author
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10">
              {groups.contributor.map((book) => (
                <BookRow key={book.slug} book={book} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
