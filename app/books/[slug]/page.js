import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';

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
    publisher: book.publisher ? {
      '@type': 'Organization',
      name: book.publisher,
    } : null,
    url: `https://edmondaporter.com/books/${book.slug}`,
    offers: {
      '@type': 'Offer',
      url: book.amazonUrl,
      availability: availability,
      price: book.price || '0.00',
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
      
      <Navigation />
      <main className="min-h-screen py-12 pt-24" style={{ backgroundColor: '#2C3E4F' }}>
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-amber-500 transition-colors mb-12"
          >
            <span className="material-symbols-outlined mr-2" style={{ fontFamily: 'Material Symbols Outlined' }}>arrow_back</span>
            Back to Home
          </Link>
          
          {/* Mobile: flex-col stacks image above content. Desktop: float layout for text wrapping */}
          <div className="flex flex-col md:block">
            {/* Book Cover - full width on mobile, floated on desktop */}
            <div className="relative aspect-[2/3] w-full max-w-xs md:max-w-sm lg:max-w-md md:float-left md:mr-8 md:mb-4 mx-auto md:mx-0 rounded-lg shadow-2xl overflow-hidden mb-6 md:mb-0">
              <Image
                src={`/images/${book.image}`}
                alt={`${book.title} book cover`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
            
            {/* Book Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-headline mb-4">
                {book.title}
              </h1>
              
              <p className="text-sm text-slate-400 mb-6">
                {book.authorship === 'contributor' ? 'Featuring Edmond A Porter' : 'By Edmond A Porter'}
              </p>
              
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-body">
                {book.description}
              </p>
              
              {/* CTA Button */}
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 px-4 border-2 border-[#FDC29A] text-[#FDC29A] font-bold uppercase tracking-widest rounded-t-lg bg-transparent hover:bg-[#FDC29A] hover:text-[#2C3E4F] transition-colors duration-300"
              >
                Buy on Amazon
                <span className="material-symbols-outlined ml-1">open_in_new</span>
              </a>
            </div>

            {/* Extended Content - wraps around floated image on desktop, clears below on mobile */}
            {book.body && (
              <div className="mt-8 md:mt-2 pt-2 clear-both md:clear-none">
                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-a:text-[#FDC29A]">
                  <ReactMarkdown>{book.body}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
