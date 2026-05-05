'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ContentWithLinks from '@/app/components/ContentWithLinks';
import Navigation from '@/src/components/Navigation';
import Footer from '@/src/components/Footer';
import Image from 'next/image';
import { getImagePath as getAssetPath } from '@/src/utils/cdn';
import { fallbackContent } from '@/src/data/fallbackContent';
// Import CMS content directly for static generation
import aboutBioData from '@/public/content/about-bio.json';
import timeline2025 from '@/public/content/timeline/2025.json';
import timeline2026 from '@/public/content/timeline/2026.json';

// Process inline formatting (bold/italic) on text
const processInline = (text) => {
  // Bold first (**text**)
  let result = text.split('**').map((part, index) => {
    if (index % 2 === 1) return `<strong class="font-bold">${part}</strong>`;
    return part;
  }).join('');
  
  // Then italic (*text*)
  result = result.split('*').map((part, index) => {
    if (index % 2 === 1) return `<em class="italic">${part}</em>`;
    return part;
  }).join('');
  
  return result;
};

// Simple markdown to HTML converter
const convertMarkdown = (text) => {
  if (!text) return text;
  
  let result = text;
  
  // Convert headers using string methods (no regex)
  result = result.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      return `<h3 class="font-headline text-2xl font-bold text-primary mb-4 mt-8">${trimmed.slice(4)}</h3>`;
    }
    if (trimmed.startsWith('## ')) {
      return `<h2 class="font-headline text-xl font-bold text-primary mb-6 mt-8">${trimmed.slice(3)}</h2>`;
    }
    if (trimmed.startsWith('# ')) {
      return `<h1 class="font-headline text-4xl font-bold text-primary mb-6 mt-8">${trimmed.slice(2)}</h1>`;
    }
    return line;
  }).join('\n');
  
  // Convert markdown links [text](url) to HTML with inline formatting inside
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    const processedText = processInline(linkText);
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-secondary hover:underline">${processedText}</a>`;
  });
  
  // Process remaining inline formatting (text not in links)
  result = processInline(result);
  
  // Split into paragraphs and wrap non-header content
  const paragraphs = result.split('\n');
  const processedParagraphs = paragraphs.map(paragraph => {
    if (!paragraph.trim()) return '';
    if (paragraph.startsWith('<h')) return paragraph;
    return `<p class="leading-relaxed max-w-2xl mx-auto md:mx-0 font-headline text-lg md:text-xl text-on-surface-variant">${paragraph}</p>`;
  })
    .join('\n')
    .replace(/<p class="leading-relaxed max-w-2xl mx-auto md:mx-0 font-headline text-lg md:text-xl text-on-surface-variant"><\/p>/g, '');
  
  return processedParagraphs;
};

export default function AboutPage() {
  // Use imported CMS content directly (baked in at build time)
  const aboutBioContent = aboutBioData || fallbackContent.aboutBio;
  // Build timeline array from imported JSON files
  const timelineContent = [timeline2025, timeline2026] || fallbackContent.timeline;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
  
  return (
    <div className="bg-background">
      <Navigation />
      
      <main className="pt-16 md:pt-16">
        {/* About Hero - Side by side layout */}
        <section className="relative overflow-hidden py-4 md:py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <div className="order-2 md:order-1 text-center md:text-left">
              <span className="font-label text-sm uppercase tracking-widest text-secondary font-semibold mb-4 block">{aboutBioContent?.bioLabel || 'About the Author'}</span>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">{aboutBioContent?.bioHeadline}</h1>
              <p className="font-headline text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-2xl italic mx-auto md:mx-0">
                {aboutBioContent?.bioSubtitle}
              </p>
            </div>
            
            {/* Bio Image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="max-w-[320px] md:max-w-md w-full relative">
                {/* Decorative square behind image */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-secondary/30 rounded-lg -z-10"></div>
                <div className="aspect-[2/3] bg-surface-container-high relative overflow-hidden shadow-2xl rounded-lg">
                  <Image 
                    src={getAssetPath(aboutBioContent?.bioImage)}
                    alt="Edmond A Porter"
                    className="w-full h-full object-cover"
                    fill
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Bio Section */}
        <section className="py-8 md:py-16 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto px-6">
            <ContentWithLinks 
              html={convertMarkdown(aboutBioContent?.bioBody || '')}
              className="prose prose-lg prose-slate max-w-none prose-headings:font-headline prose-headings:text-primary prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-4 prose-h3:mt-8 prose-p:mb-6 [&_p]:max-w-none [&_p]:w-full"
            />
          </div>
        </section>
        
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
