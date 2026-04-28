import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';

// Read all book JSON files and return static params
export async function generateStaticParams() {
  const booksDir = path.join(process.cwd(), 'public/content/books');
  const files = fs.readdirSync(booksDir);
  
  const books = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(booksDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const book = JSON.parse(content);
      return { slug: book.slug };
    })
    .filter(item => item.slug); // Only include books with a valid slug
  
  return books;
}

// Generate metadata from book's SEO object
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public/content/books', `${slug}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const book = JSON.parse(content);
    
    return {
      title: book.seo.metaTitle,
      description: book.seo.metaDescription,
      openGraph: {
        title: book.seo.metaTitle,
        description: book.seo.metaDescription,
        images: [`/images/${book.image}`],
      },
    };
  } catch (error) {
    return {
      title: 'Book | Edmond A Porter',
      description: 'Discover this book by Edmond A Porter.',
    };
  }
}

// Book landing page component
export default async function BookPage({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public/content/books', `${slug}.json`);
  
  let book;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    book = JSON.parse(content);
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Book Not Found</h1>
          <Link href="/" className="text-amber-500 hover:text-amber-400">
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  
  // Determine availability based on release date
  const hasReleaseDate = book.releaseDate && book.releaseDate.trim() !== '';
  let availability = 'https://schema.org/InStock';
  if (hasReleaseDate) {
    const releaseDate = new Date(book.releaseDate);
    const today = new Date();
    if (releaseDate > today) {
      availability = 'https://schema.org/PreOrder';
    }
  }
  
  // Build Book schema.org structured data
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    image: `https://edmondaporter.com/images/${book.image}`,
    author: {
      '@type': 'Person',
      name: 'Edmond A Porter',
      url: 'https://edmondaporter.com',
    },
    isbn: '',
    bookFormat: 'EBook',
    numberOfPages: null,
    datePublished: hasReleaseDate ? new Date(book.releaseDate).toISOString() : null,
    publisher: '',
    url: `https://edmondaporter.com/books/${book.slug}`,
    offers: {
      '@type': 'Offer',
      url: book.amazonUrl,
      availability: availability,
      price: '0.00',
      priceCurrency: 'USD',
    },
  };
  
  // Remove null values from schema
  const cleanSchema = Object.fromEntries(
    Object.entries(bookSchema).filter(([_, v]) => v !== null)
  );
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
      />
      
      <main className="min-h-screen bg-slate-900 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-amber-500 transition-colors mb-12"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Home
          </Link>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Book Cover */}
            <div className="relative aspect-[2/3] max-w-md mx-auto md:mx-0">
              <Image
                src={`/images/${book.image}`}
                alt={`${book.title} book cover`}
                fill
                className="object-cover rounded-lg shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Book Info */}
            <div className="flex flex-col">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-headline">
                {book.title}
              </h1>
              
              {hasReleaseDate && (
                <div className="flex items-center text-slate-400 mb-6">
                  <span className="material-symbols-outlined mr-2">calendar_today</span>
                  <span>Release Date: {book.releaseDate}</span>
                </div>
              )}
              
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-body">
                {book.description}
              </p>
              
              {/* CTA Button */}
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="material-symbols-outlined mr-2">shopping_cart</span>
                Buy on Amazon
                <span className="material-symbols-outlined ml-2">open_in_new</span>
              </a>
              
              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-sm text-slate-500">
                  By Edmond A Porter
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
