'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function ContentWithLinks({ html, className }) {
  const router = useRouter();

  const handleClick = useCallback((e) => {
    // Find closest anchor tag
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Only handle internal links
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      router.push(href);
    }
  }, [router]);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={handleClick}
    />
  );
}
