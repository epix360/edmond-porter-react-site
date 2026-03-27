import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Head from '../components/Head';
import StructuredData from '../components/SEO/StructuredData';
import AccessibleImage from '../components/Accessibility/AccessibleImage';
import { getImagePath as getAssetPath } from '../utils/cdn';
import { useCMSContent, fallbackContent } from '../hooks/useCMSContent';

// Helper function for consistent image paths (now using CDN)
const getImagePath = (path) => getAssetPath(path);

// Simple markdown to HTML converter
const convertMarkdown = (text) => {
    if (!text) return '';
    
    return text
        // Convert headers FIRST (before paragraphs)
        .replace(/^### (.*$)/gim, '<h3 class="font-headline text-2xl font-bold text-primary mb-4 mt-8">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="font-headline text-3xl font-bold text-primary mb-6 mt-8">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="font-headline text-4xl font-bold text-primary mb-6 mt-8">$1</h1>')
        // Convert bold text
        .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
        // Convert italic text
        .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
        // Split into paragraphs and wrap non-header content
        .split('\n\n')
        .map(paragraph => {
            // Skip empty paragraphs
            if (!paragraph.trim()) return '';
            
            // Check if this is already a header
            if (paragraph.startsWith('<h')) {
                return paragraph;
            }
            
            // Wrap in paragraph tags
            return `<p class="mb-6">${paragraph}</p>`;
        })
        .join('\n')
        // Clean up any remaining empty paragraphs
        .replace(/<p class="mb-6"><\/p>/gim, '');
};

const AboutPage = () => {
    // Load CMS content for about page
    const { content: aboutBio, loading: aboutBioLoading, error: aboutBioError } = useCMSContent('about-bio');
    const { content: timeline, loading: timelineLoading, error: timelineError } = useCMSContent('timeline');
    
    // Use fallback content if CMS fails
    const aboutBioContent = aboutBio || fallbackContent.aboutBio;
    const timelineContent = timeline || fallbackContent.timeline;
    
    // Debug: Log content loading
    console.log('AboutBio content:', aboutBioContent);
    console.log('AboutBio loading:', aboutBioLoading);
    console.log('AboutBio error:', aboutBioError);
    console.log('Using fallback:', !aboutBio ? 'YES' : 'NO');
    
    // Enhanced error handling
    if (aboutBioError) {
        console.error('❌ AboutBio loading error:', aboutBioError);
    }
    if (aboutBioLoading) {
        console.log('⏳ AboutBio still loading...');
    }
    
    // Timeline data is already sorted by year from useCMSContent
    const timelineData = timelineContent.map(yearData => ({
      year: yearData.year,
      milestones: [
        yearData.milestone1_title ? {
          title: yearData.milestone1_title,
          description: yearData.milestone1_description || ''
        } : null,
        yearData.milestone2_title ? {
          title: yearData.milestone2_title,
          description: yearData.milestone2_description || ''
        } : null,
        yearData.milestone3_title ? {
          title: yearData.milestone3_title,
          description: yearData.milestone3_description || ''
        } : null
      ].filter(Boolean) // Remove null entries
    }));
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
    <div className="bg-background">
        <Head 
          title="About Edmond A Porter"
          description="Learn about Edmond A Porter, contemporary author exploring human experience through compelling narratives. Discover his biography, literary achievements, and writing journey."
          canonicalUrl="/about"
          ogImage="/images/Edmond_Seated.webp"
          structuredData={{ type: 'author', data: { books: aboutBioContent?.books || fallbackContent.books } }}
        />
        <Navigation />
        <main className="pt-24">
            {/* About Hero */}
            <section className="relative overflow-hidden py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
                    <div className="md:col-span-7 z-10 text-center md:text-left order-2 md:order-1">
                        <span className="font-label text-sm tracking-[0.2em] uppercase text-secondary font-semibold mb-4 block">The Modern Archivist</span>
                        <h1 className="font-headline text-4xl md:text-7xl font-bold text-primary leading-tight mb-6">{aboutBioContent.bioHeadline}</h1>
                        <p className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl italic mx-auto md:mx-0 mb-6">
                            {aboutBioContent.bioSubtitle}
                        </p>
                    </div>
                    <div className="md:col-span-5 relative order-1 md:order-2">
                        <div className="aspect-[4/5] bg-surface-container-high relative z-10 overflow-hidden shadow-2xl rounded-lg max-w-[320px] md:max-w-none mx-auto">
                            <AccessibleImage 
                            src={getImagePath(aboutBioContent.bioImage)}
                            alt="Edmond A Porter"
                            className="w-full h-full object-cover"
                        />
                        </div>
                        <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-32 h-32 md:w-48 md:h-48 bg-secondary/10 -z-0"></div>
                    </div>
                </div>
            </section>

            {/* Bio Section */}
            <section className="py-16 md:py-24 bg-surface-container-lowest">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-lg prose-slate max-w-none">
                        <div className="text-on-surface-variant leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: convertMarkdown(aboutBioContent.bioBody) }} />
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-surface-container-low">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="font-headline text-3xl font-bold text-primary mb-16 text-center">Milestones & Moments</h2>
                    <div className="space-y-12">
                        {timelineContent && Array.isArray(timelineContent) && timelineContent.map((yearData, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-4 h-4 rounded-full bg-secondary group-hover:scale-125 transition-transform"></div>
                                    {idx !== (timelineContent && timelineContent.length - 1) && <div className="w-0.5 flex-1 bg-outline-variant/30 mt-2"></div>}
                                </div>
                                <div className="pb-12">
                                    <span className="font-label text-sm text-secondary font-bold mb-1 block">{yearData.year}</span>
                                    {yearData.milestone1_title && (
                                        <div className="mb-6 last:mb-0">
                                            <h4 className="font-headline text-xl font-bold text-primary mb-2">{yearData.milestone1_title}</h4>
                                            <div className="text-on-surface-variant font-body" dangerouslySetInnerHTML={{ __html: convertMarkdown(yearData.milestone1_description) }} />
                                        </div>
                                    )}
                                    {yearData.milestone2_title && (
                                        <div className="mb-6 last:mb-0">
                                            <h4 className="font-headline text-xl font-bold text-primary mb-2">{yearData.milestone2_title}</h4>
                                            <div className="text-on-surface-variant font-body" dangerouslySetInnerHTML={{ __html: convertMarkdown(yearData.milestone2_description) }} />
                                        </div>
                                    )}
                                    {yearData.milestone3_title && (
                                        <div className="mb-6 last:mb-0">
                                            <h4 className="font-headline text-xl font-bold text-primary mb-2">{yearData.milestone3_title}</h4>
                                            <div className="text-on-surface-variant font-body" dangerouslySetInnerHTML={{ __html: convertMarkdown(yearData.milestone3_description) }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
        <Footer />
    </div>
    );
};

export default AboutPage;
