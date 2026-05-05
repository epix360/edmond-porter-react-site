import AboutClient from './AboutClient';
import fs from 'fs';
import path from 'path';

// Function to load page data from JSON
async function getPageData() {
  try {
    const filePath = path.join(process.cwd(), 'public/content/about-bio.json');
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error loading about page data:', error);
    return {
      metaTitle: 'About | Edmond A Porter',
      metaDescription: 'Learn about Edmond A Porter, contemporary author exploring human experience through compelling narratives.',
      ogTitle: 'About Edmond A Porter',
      ogDescription: 'Discover the biography, literary achievements, and writing journey of Edmond A Porter.',
      ogImage: '/images/Edmond_Seated.webp'
    };
  }
}

export async function generateMetadata() {
  const data = await getPageData();
  const seo = data.seo || {};
  
  return {
    title: seo.metaTitle || data.metaTitle || 'About | Edmond A Porter',
    description: seo.metaDescription || data.metaDescription || 'Learn about Edmond A Porter.',
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || data.ogTitle || data.metaTitle || 'About Edmond A Porter',
      description: seo.ogDescription || seo.metaDescription || data.ogDescription || data.metaDescription || 'Discover the biography and writing journey of Edmond A Porter.',
      url: '/about',
      images: [seo.ogImage || data.ogImage || '/images/Edmond_Seated.webp'],
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
