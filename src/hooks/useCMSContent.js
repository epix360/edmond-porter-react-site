'use client';

import { useState, useEffect } from 'react';
import { fallbackContent } from '@/src/data/fallbackContent';

// Hook to load content from CMS files
export const useCMSContent = (contentType, filename = null) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        if (contentType === 'books') {
          // Load books-index.json for centralized book data
          const url = '/content/books-index.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load books-index.json: ${response.status}`);
          const booksData = await response.json();
          
          // Sort books by order field with automatic reordering for duplicates
          const sortedBooks = booksData.sort((a, b) => {
            const orderA = a.order || 999; // Default to high number if no order
            const orderB = b.order || 999;
            return orderA - orderB;
          });
          
          // Handle automatic reordering: if multiple books have same order, 
          // increment subsequent books to maintain unique ordering
          let orderCounter = 1;
          const reorderedBooks = sortedBooks.map((book, index) => {
            if (index > 0 && sortedBooks[index - 1].order === book.order) {
              orderCounter++;
            }
            return { ...book, order: book.order + orderCounter - 1 };
          });
          
          setContent(reorderedBooks);
        } else if (contentType === 'hero') {
          // Load hero content
          const url = '/content/hero.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load hero content: ${response.status}`);
          const heroData = await response.json();
          setContent(heroData);
        } else if (contentType === 'home-bio') {
          // Load home bio content
          const url = '/content/home-bio.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load home-bio content: ${response.status}`);
          const homeBioData = await response.json();
          setContent(homeBioData);
        } else if (contentType === 'about-bio') {
          // Load about-bio content
          const url = '/content/about-bio.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load about-bio content: ${response.status}`);
          const aboutBioData = await response.json();
          setContent(aboutBioData);
        } else if (contentType === 'medium-section') {
          // Load medium section content
          const url = '/content/medium-section.json';
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to load medium-section content: ${response.status}`);
          const mediumSectionData = await response.json();
          setContent(mediumSectionData);
        } else if (contentType === 'timeline') {
          // Load timeline data from window object (embedded during build)
          // This avoids all GitHub Pages routing issues while maintaining CMS connectivity
          try {
            if (window.embeddedTimelineData) {
              setContent(window.embeddedTimelineData);
            } else {
              // Fallback to hardcoded data
              setContent(fallbackContent.timeline);
            }
          } catch (error) {
            // Fallback to hardcoded data
            const timelineData = fallbackContent.timeline;
            setContent(timelineData);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentType]);

  return { content, loading, error };
};

// Re-export fallbackContent for backward compatibility
export { fallbackContent } from '@/src/data/fallbackContent';
