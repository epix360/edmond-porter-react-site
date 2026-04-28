import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';

// Reserved slugs that cannot be used for CMS pages
const RESERVED_SLUGS = ['about', 'admin', 'books'];

// Read all page JSON files and return static params
export async function generateStaticParams() {
  const pagesDir = path.join(process.cwd(), 'public/content/pages');
  
  // If directory doesn't exist or is empty, return empty array
  if (!fs.existsSync(pagesDir)) {
    return [];
  }
  
  const files = fs.readdirSync(pagesDir);
  
  const pages = files
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(pagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const page = JSON.parse(content);
      
      // Safeguard: Check for reserved slugs
      if (RESERVED_SLUGS.includes(page.slug)) {
        throw new Error(
          `Cannot create CMS page with reserved slug: "${page.slug}". ` +
          `This conflicts with internal routes. Please rename the file: ${file}`
        );
      }
      
      return { slug: page.slug };
    })
    .filter(item => item.slug); // Only include pages with a valid slug
  
  return pages;
}

// Generate metadata from page's SEO object
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public/content/pages', `${slug}.json`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const page = JSON.parse(content);
    
    return {
      title: page.seo?.metaTitle || `${page.title} | Edmond A Porter`,
      description: page.seo?.metaDescription || page.body?.slice(0, 160) || '',
      openGraph: {
        title: page.seo?.metaTitle || page.title,
        description: page.seo?.metaDescription || page.body?.slice(0, 160) || '',
      },
    };
  } catch (error) {
    return {
      title: 'Page | Edmond A Porter',
      description: 'Discover this page by Edmond A Porter.',
    };
  }
}

// Generic catch-all page component
export default async function GenericPage({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'public/content/pages', `${slug}.json`);
  
  let page;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    page = JSON.parse(content);
  } catch (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-slate-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Return Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-900">
        {/* Hero Section */}
        <section className="bg-slate-800 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-headline mb-4">
              {page.title}
            </h1>
            <Link
              href="/"
              className="inline-flex items-center text-slate-400 hover:text-amber-500 transition-colors text-sm"
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-amber-500 transition-colors text-sm"
          >
            <span className="material-symbols-outlined mr-1">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg prose-invert prose-slate max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white font-headline mb-6 mt-8">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white font-headline mb-4 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-white font-headline mb-4 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-300 leading-relaxed mb-4 font-body">{children}</p>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:text-amber-400 underline transition-colors"
                  >
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-300 mb-4 ml-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-slate-300 mb-4 ml-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="mb-2">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-amber-500 pl-4 italic text-slate-400 my-6">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-slate-700 my-8" />,
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-300">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-slate-800 text-amber-400 px-2 py-1 rounded text-sm font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
              }}
            >
              {page.body}
            </ReactMarkdown>
          </article>
        </div>
      </section>
    </main>
  );
}
