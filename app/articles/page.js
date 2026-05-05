import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';
import ClientArticlesGrid from '@/app/components/ClientArticlesGrid';

export const metadata = {
  title: 'Articles | Edmond A Porter',
  description: 'Latest articles and thoughts from Edmond A Porter on writing, creativity, and the stories behind the stories.',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: 'Articles | Edmond A Porter',
    description: 'Latest articles and thoughts on writing, creativity, and storytelling.',
    url: '/articles',
  },
};

export default function ArticlesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen py-12 pt-24 bg-surface-container-lowest">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-8"
        >
          <span className="material-symbols-outlined mr-1">arrow_back</span>
          Back to Home
        </Link>
        
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline mb-4">
            Latest Articles
          </h1>
          <p className="text-lg text-on-surface-variant">
            Thoughts on writing, creativity, and the stories behind the stories. 
            All articles originally published on Medium.
          </p>
        </header>
        
        {/* Articles Grid - Client-side fetched */}
        <ClientArticlesGrid />
        
        {/* Footer Link to Medium */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-on-surface-variant mb-4">
            Want to see more?
          </p>
          <a
            href="https://medium.com/@eporter609"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors"
          >
            View all articles on Medium
            <span className="material-symbols-outlined ml-1">open_in_new</span>
          </a>
        </div>
      </div>
    </main>
    <Footer />
  </>
  );
}
