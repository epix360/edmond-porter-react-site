import AboutClient from './AboutClient';

export const metadata = {
  title: 'About | Edmond A Porter',
  description: 'Learn about Edmond A Porter, contemporary author exploring human experience through compelling narratives. Discover his biography, literary achievements, and writing journey.',
  openGraph: {
    title: 'About Edmond A Porter',
    description: 'Discover the biography, literary achievements, and writing journey of Edmond A Porter.',
    images: ['/images/Edmond_Seated.webp'],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
