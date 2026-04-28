'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="text-on-surface-variant leading-relaxed space-y-6">
                <h2 className="font-headline text-3xl font-bold text-primary mb-6 mt-8">My name is Edmond, and I am from Idaho.</h2>
                <p className="mb-6">I am four generations removed from the Mormon pioneers who settled in the Idaho part of Cache Valley. Even though I lived more than one-third of my life in Washington and the last three years in Utah, I'm still from Idaho. More specifically, I am from Preston, known for Napoleon Dynamite and That Famous Preston Night Rodeo, not potatoes.</p>
                <p className="mb-6">Being from Preston doesn't necessarily mean I lived in the city of Preston. Any place in Franklin County qualifies as being from Preston. I grew up on a farm my grandparents bought ten miles east of Preston when they were newly married. My father bought it from his father.</p>
                <p className="mb-6">I guess you could classify our family business as dairy farming, but there were a few chickens, pigs, and turkeys thrown into the mix. Life on the farm was great. I was driving a tractor by the time I was six, motorbikes by age nine, and trucks as soon as I was tall enough to see out of the windshield and depress the clutch at the same time.</p>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4 mt-8">My name is Edmond, and I am a geek.</h3>
                <p className="mb-6">I spent a lot of time alone operating farm equipment, and my mind needed stimulation. As I spent my days on a tractor seat or in the barn milking cows, I pretended to be a television announcer detailing the events of the day. My narration was spoken aloud if I was alone and under my breath if I wasn't.</p>
                <p className="mb-6">Despite my tendency to talk to myself, I developed a reputation for being intelligent in school. Reading and basic math were easy for me, and my classmates noticed. Once a reputation is gained, it must be maintained, and that is not easy. I read every night and morning on the school bus and always turned in my homework on time. Instead of playing softball at recess, I became the umpire. Not everybody agrees with the umpire's call, but it can't be disputed if everyone thinks you are the smartest kid in class.</p>
                <p className="mb-6">High school cracked the façade of being smart, but struggling for Cs in college and being turned down twice for a graduate program busted it into little pieces. I picked up the pieces, graduated with a degree in biology, and went on to have a forty-five-year career in the canned food industry.</p>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4 mt-8">My name is Edmond, and I am a son.</h3>
                <p className="mb-6">When I was in ninth grade and as tall as my peers for the last time in my life, I thought about trying out for the junior high football team. My father, who had no interest in sports, discouraged me from playing. He didn't say I couldn't try out, but there was a not-so-subtle reminder that there were chores to do every night after school at the same time as football practice. That made me realize how important I was to the family farm. I was almost persuaded by that argument alone, but then he told me about his brother, who had been an athlete in high school and played on an eight-man football team. A knee injury that appeared not to be serious plagued his brother all his life. It was the first time I understood just how much my father cared about my welfare.</p>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4 mt-8">My name is Edmond, and I am a father and grandfather.</h3>
                <p className="mb-6">There is nothing more important than family. Families form a chain that stretches for generations in both directions. I knew my grandparents well. I lived with my parents for twenty-five years, minus a brief period here and there, before I got married and formed my nuclear family. My wife and I raised five children, and now we have eight grandchildren. I am the middle link of the chain.</p>
                <p className="mb-6">When our oldest was a newborn, I often stood by her crib listening to make sure she was breathing. I learned that was not necessary. Children breathe on their own, and they grow up on their own.</p>
                <p className="mb-6">As they grew, I read to each of them every night at bedtime. I went to band concerts, choir concerts, and drama performances. Now they do those things for their children, and occasionally, Grandpa gets to experience some of those things with the next generation. I am content to be the middle link in the generational chain.</p>
                <h3 className="font-headline text-2xl font-bold text-primary mb-4 mt-8">My name is Edmond. I am a writer.</h3>
                <p className="mb-6">I began writing when I was in third grade. I tried my hand at news articles, fiction, and fan fiction. Most of the writing I did in high school remained hidden, except for the editorials I wrote as editor of my high school newspaper. In college, I had one paper that a professor thought might be worthy of publication, but I didn't know how to proceed. I wrote budget proposals and other work-related documents. Now that I am retired, I have been published in three anthologies, two newsletters, and online. My first short book of essays and poems was published on Amazon in October of 2025. Recently, I was awarded first and third place in the first chapter and creative nonfiction divisions of the League of Utah Writers' annual contest.</p>
                <p className="mb-6">My first novel, Turbulent Waters, a historical romance set surrounding the building and ultimate failure of the Teton Dam, is set for release on June 1, 2026, to coincide with the 50th anniversary of the Teton Dam Flood.</p>
              </div>
            </div>
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
