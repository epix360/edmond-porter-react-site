import fs from 'fs';
import path from 'path';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';
import ContentWithLinks from '@/app/components/ContentWithLinks';
import AboutBookshelf from '@/app/components/AboutBookshelf';
import { getResponsiveImage } from '@/app/utils/responsiveImage';
import { convertMarkdown } from '@/app/utils/markdown';
import { fallbackContent } from '@/src/data/fallbackContent';
import { allBooks, sortBooks } from '@/lib/books';

function loadAboutData() {
  try {
    const filePath = path.join(process.cwd(), 'public/content/about-bio.json');
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading about page data:', error);
    return fallbackContent.aboutBio || {};
  }
}

const aboutData = loadAboutData();

const bookshelfSchemaData = {
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
        ? book.formats.map(f => ({
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

function loadTimeline() {
  const timelineDir = path.join(process.cwd(), 'public/content/timeline');
  let files;
  try {
    files = fs.readdirSync(timelineDir).filter(file => file.endsWith('.json'));
  } catch (error) {
    console.error('Error reading timeline directory:', error);
    return [];
  }

  return files
    .map(file => {
      try {
        const content = fs.readFileSync(path.join(timelineDir, file), 'utf8');
        return JSON.parse(content);
      } catch (error) {
        console.error(`Error loading timeline ${file}:`, error);
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => String(a.year).localeCompare(String(b.year)));
}

export async function generateMetadata() {
  const data = aboutData;
  const seo = data.seo || {};
  const title = seo.metaTitle || data.metaTitle || 'About | Edmond A Porter';
  const description = seo.metaDescription || data.metaDescription || 'Learn about Edmond A Porter.';
  const image = seo.ogImage || data.ogImage || '/images/Edmond_Seated.webp';

  return {
    title,
    description,
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || data.ogTitle || data.metaTitle || 'About Edmond A Porter',
      description: seo.ogDescription || seo.metaDescription || data.ogDescription || data.metaDescription || 'Discover the biography and writing journey of Edmond A Porter.',
      url: '/about',
      siteName: 'Edmond A Porter',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle || seo.metaTitle || title,
      description: seo.ogDescription || seo.metaDescription || description,
      images: [image],
    },
  };
}

export default function AboutPage() {
  const aboutBio = aboutData;
  const timeline = loadTimeline();

  const timelineData = timeline.map(yearData => ({
    year: yearData.year,
    milestones: [1, 2, 3]
      .filter(n => yearData[`milestone${n}_title`])
      .map(n => ({
        title: yearData[`milestone${n}_title`],
        description: yearData[`milestone${n}_description`] || '',
      })),
  }));

  const bio = getResponsiveImage(aboutBio.bioImage);

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookshelfSchemaData) }}
      />
      <Navigation />

      <main className="pt-16 md:pt-16">
        {/* About Hero */}
        <section className="relative overflow-hidden py-4 md:py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1 text-center md:text-left">
              <span className="font-label text-sm uppercase tracking-widest text-secondary font-semibold mb-4 block">
                {aboutBio.bioLabel || 'About the Author'}
              </span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
                {aboutBio.bioHeadline}
              </h1>
              <p className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl italic mx-auto md:mx-0">
                {aboutBio.bioSubtitle}
              </p>
            </div>

            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="max-w-[320px] md:max-w-md w-full relative">
                <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-secondary/30 rounded-lg -z-10"></div>
                <div className="aspect-[2/3] bg-surface-container-high relative overflow-hidden shadow-2xl rounded-lg">
                  <img
                    src={bio.src}
                    srcSet={bio.srcSet}
                    sizes="(max-width: 768px) 90vw, 448px"
                    alt="Edmond A Porter"
                    width={448}
                    height={672}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bio Body */}
        <section className="py-8 md:py-16 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto px-6">
            <ContentWithLinks
              html={convertMarkdown(aboutBio.bioBody || '')}
              className="prose prose-lg prose-slate max-w-none prose-headings:font-headline prose-headings:text-primary prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-4 prose-h3:mt-8 prose-p:mb-6 [&_p]:max-w-none [&_p]:w-full"
            />
          </div>
        </section>

        <AboutBookshelf />

        {/* Timeline */}
        <section className="py-16 bg-surface-container-low">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-headline text-3xl font-bold text-primary mb-16 text-center">Milestones &amp; Moments</h2>
            <div className="space-y-12">
              {timelineData.map((yearData, yearIndex) => (
                <div key={yearIndex} className="flex gap-8">
                  <div className="flex flex-col items-center relative">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    {yearIndex < timelineData.length - 1 && (
                      <div className="w-px h-full bg-secondary mt-2 absolute top-3 left-1/2 -translate-x-1/2"></div>
                    )}
                  </div>
                  <div>
                    <span className="font-label text-sm text-secondary font-bold mb-1 block">{yearData.year}</span>
                    {yearData.milestones.map((milestone, milestoneIndex) => (
                      <div key={milestoneIndex} className="mb-6 last:mb-0">
                        <h4 className="font-headline text-xl font-bold text-primary mb-2">{milestone.title}</h4>
                        <div
                          className="text-on-surface-variant font-body"
                          dangerouslySetInnerHTML={{ __html: convertMarkdown(milestone.description) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
