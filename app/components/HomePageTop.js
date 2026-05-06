'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/src/components/Navigation';
import { getImagePath as getAssetPath } from '@/app/utils/cdn';
import { getResponsiveImage } from '@/app/utils/responsiveImage';
import { fallbackContent } from '@/src/data/fallbackContent';
// Import CMS content directly for static generation
import heroData from '@/public/content/hero.json';
import homeBioData from '@/public/content/home-bio.json';
import { allBooks, sortBooks } from '@/lib/books';

// Helper function for consistent image paths
const getImagePath = (path) => getAssetPath(path);

// Status template configurations
const getStatusTemplate = (status, showSpecificDate, releaseDate, customDateText) => {
  const templates = {
    "coming-soon": { 
      icon: "calendar_today", 
      text: getComingSoonText(showSpecificDate, releaseDate, customDateText), 
      color: "text-secondary-fixed-dim",
      label: "Coming Soon"
    },
    "new-release": { 
      icon: "auto_awesome", 
      text: "New Release!", 
      color: "text-secondary",
      label: "Just Released"
    },
    "bestseller": { 
      icon: "military_tech", 
      text: "Bestseller", 
      color: "text-amber-600",
      label: "Bestselling Book"
    },
    "available": { 
      icon: "check_circle", 
      text: "Available Now", 
      color: "text-primary",
      label: "Available"
    }
  };
  
  return templates[status] || templates["available"];
};

// Helper function for coming soon text (uses UTC to avoid hydration mismatch)
const getComingSoonText = (showSpecificDate, releaseDate, customDateText) => {
  if (customDateText) return customDateText;
  if (showSpecificDate && releaseDate) {
    const date = new Date(releaseDate);
    return `Coming ${date.toLocaleDateString('en-US', { 
      timeZone: 'UTC',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  }
  return "Coming Soon";
};

export default function HomePageTop() {
  // Use imported CMS content directly (baked in at build time)
  const heroContent = heroData || fallbackContent.hero;
  const homeBioContent = homeBioData || fallbackContent.homeBio;
  
  const sortedBooks = sortBooks(allBooks);
  
  // Get status template
  const statusTemplate = getStatusTemplate(
    heroContent.bookStatus, 
    heroContent.showSpecificDate, 
    heroContent.releaseDate, 
    heroContent.customDateText
  );
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle hash scrolling for cross-page navigation
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // requestAnimationFrame ensures the browser has completely finished painting the DOM
      requestAnimationFrame(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, []);

  return (
    <>
      <Navigation />
      
      <main className="pt-16 md:pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[800px] flex items-center overflow-hidden bg-primary-container">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #805533 0%, transparent 50%)"}}></div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 items-center relative z-10 py-12 md:py-20">
            <div className="order-2 md:order-1 text-center md:text-left">
              <h1 className="sr-only">
                Edmond A Porter: Award-Winning Utah Author | Official Website
              </h1>
              {statusTemplate && (
                <span className={`inline-block font-label uppercase tracking-[0.2em] font-bold mb-1 sm:mb-4 text-sm ${statusTemplate.color}`}>
                  {statusTemplate.label}
                </span>
              )}
              <h2 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                {heroContent?.title?.split(' ').map((word, i) => 
                  i === 0 ? word : <React.Fragment key={i}><br className="hidden sm:block" /><span className="italic text-[#B8C8DB] sm:inline">{' '}{word}</span></React.Fragment>
                ) || 'Edmond A Porter'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-on-primary-container mb-3 sm:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed font-light">
                {heroContent?.blurb || 'Author of contemporary fiction'}
              </p>
              <div className="flex flex-col sm:flex-row-reverse md:justify-end gap-4">
                {statusTemplate && (
                  <div className={`flex items-center justify-center space-x-2 font-label ${statusTemplate.color}`}>
                    <span className="material-symbols-outlined">{statusTemplate.icon}</span>
                    <span>{statusTemplate.text}</span>
                  </div>
                )}
                <a className="bg-secondary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-center hover:bg-[#96643c] transition-colors shadow-lg shadow-black/20" href={heroContent?.link || '#'} target="_blank" rel="noopener noreferrer">
                  {heroContent?.buttonText || 'Learn More'}
                </a>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              {(() => {
                const hero = getResponsiveImage('Turbulent_Waters.webp');
                return (
                  <img
                    src={hero.src}
                    srcSet={hero.srcSet}
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 448px"
                    alt="Turbulent Waters book cover"
                    width={400}
                    height={600}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="relative z-10 rounded-lg shadow-2xl w-full max-w-[280px] sm:max-w-[320px] md:max-w-md aspect-[2/3] object-cover"
                  />
                );
              })()}
            </div>
          </div>
        </section>
        
        {/* Quick About Link */}
        <section className="py-12 bg-surface-bright" id="about-teaser">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5 relative">
                {(() => {
                  const teaser = getResponsiveImage(homeBioContent?.teaserImage || 'Edmond_Headshot.webp');
                  return (
                    <img
                      src={teaser.src}
                      srcSet={teaser.srcSet}
                      sizes="(max-width: 768px) 100vw, 400px"
                      alt="Portrait"
                      width={400}
                      height={500}
                      loading="lazy"
                      decoding="async"
                      className="relative z-10 rounded-lg shadow-xl w-full aspect-[4/5] object-cover"
                    />
                  );
                })()}
              </div>
              <div className="md:col-span-7">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-8">{homeBioContent?.teaserHeadline || 'About the Author'}</h2>
                <p className="text-on-surface-variant text-lg max-w-2xl mb-6" dangerouslySetInnerHTML={{ __html: homeBioContent?.teaserBody || '<p>Edmond A Porter is a contemporary author...</p>' }} />
                <Link href="/about" className="text-secondary font-bold inline-flex items-center group">
                  {homeBioContent?.readMoreLink || 'Read More'} 
                  <span className="material-symbols-outlined ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Books Section */}
        <section className="py-12 bg-surface-container-low" id="published-works">
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <span className="font-label text-secondary uppercase tracking-widest text-sm font-bold mb-4 block">The Bibliography</span>
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">Published Works</h2>
              </div>
              <a className="flex items-center space-x-2 text-secondary font-bold hover:translate-x-2 transition-transform" href="https://www.amazon.com/stores/Edmond-A-Porter/author/B0FXDLK38Y" target="_blank" rel="noopener noreferrer">
                <span>Visit Amazon Author Page</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
              {sortedBooks.map((book, i) => {
                const cover = getResponsiveImage(book.image);
                return (
                <div key={i} className="flex flex-col h-full">
                  {/* Card with content and links inside */}
                  <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="flex justify-center -mt-12">
                      <div className="relative h-64 md:h-80 w-auto object-contain rounded shadow-lg" style={{ aspectRatio: '300 / 450', width: '300px', height: '450px' }}>
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
                      <h3 className="font-headline text-2xl font-bold text-primary mb-2">{book.title}</h3>
                      <p className="text-on-surface-variant line-clamp-3 mb-6">{book.description}</p>
                    </div>
                    
                    {/* See details - text link, left-aligned */}
                    <Link 
                      href={`/books/${book.slug}`}
                      className="inline-flex items-center text-secondary font-bold hover:text-[#b46b25] transition-colors mb-4"
                    >
                      {book.title} details
                      <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                    </Link>
                    
                    {/* Buy now - orange outline button, opens Amazon in new tab */}
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
        </section>
      </main>
    </>
  );
}
