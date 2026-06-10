'use client';

import { useEffect } from 'react';

// Home-page scroll behavior: jump to top on plain loads, smooth-scroll to
// the anchor when a #hash is present. Kept as a tiny client component so
// the page itself can stay a server component.
export default function ScrollToHash() {
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

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

  return null;
}
