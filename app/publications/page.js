import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';
import { allBooks, sortBooks } from '@/lib/books';
import { getResponsiveImage } from '@/app/utils/responsiveImage';

export const metadata = {
  title: 'Publications | Edmond A Porter',
  description: 'Browse the complete bibliography of Edmond A Porter — novels, essay collections, and anthologies rooted in the American West.',
  alternates: {
    canonical: '/publications',
  },
  openGraph: {
    title: 'Publications | Edmond A Porter',
    description: 'Browse the complete bibliography of Edmond A Porter — novels, essay collections, and anthologies rooted in the American West.',
    url: '/publications',
  },
};

export default function PublicationsPage() {
  const sortedBooks = sortBooks(allBooks);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-16 bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-8"
          >
            <span className="material-symbols-outlined mr-1">arrow_back</span>
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <span className="font-label text-secondary uppercase tracking-widest text-sm font-bold mb-4 block">The Bibliography</span>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Published Works</h1>
            </div>
            <a
              className="flex items-center space-x-2 text-secondary font-bold hover:translate-x-2 transition-transform"
              href="https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Visit Amazon Author Page</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch mt-12">
            {sortedBooks.map((book, i) => {
              const cover = getResponsiveImage(book.image);
              return (
                <div key={i} className="flex flex-col h-full">
                  <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="flex justify-center -mt-12">
                      <div className="relative rounded shadow-lg" style={{ width: '300px', height: '450px' }}>
                        <img
                          src={cover.src}
                          srcSet={cover.srcSet}
                          sizes="300px"
                          alt={book.title}
                          width={300}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 object-cover w-full h-full rounded"
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex-grow">
                      {book.type && (
                        <span className="font-label text-secondary uppercase tracking-widest text-xs font-bold mb-2 block">
                          {book.type}
                        </span>
                      )}
                      <h2 className="font-headline text-2xl font-bold text-primary mb-2">{book.title}</h2>
                      <p className="text-on-surface-variant line-clamp-3 mb-6">{book.description}</p>
                    </div>

                    <Link
                      href={`/books/${book.slug}`}
                      className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-4"
                    >
                      {book.title} details
                      <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                    </Link>

                    <a
                      href={book.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-[#8c521c] text-[#8c521c] font-bold uppercase tracking-widest rounded-t-lg bg-transparent hover:bg-[#b46b25] hover:text-white transition-colors duration-300"
                    >
                      Buy now
                      <span className="material-symbols-outlined ml-1">open_in_new</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
