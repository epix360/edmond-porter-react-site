'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ContentWithLinks({ html, className }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!html || typeof window === 'undefined') return;
    
    // Parse HTML and convert to React elements, replacing internal <a> with <Link>
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    function nodeToReact(node, index) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }
      
      const tag = node.tagName.toLowerCase();
      const props = { key: index };
      
      // Copy attributes
      for (const attr of node.attributes) {
        if (attr.name === 'class') {
          props.className = attr.value;
        } else if (attr.name !== 'target' && attr.name !== 'rel') {
          props[attr.name] = attr.value;
        }
      }
      
      // Handle internal links - convert to Next.js Link
      if (tag === 'a') {
        const href = node.getAttribute('href') || '';
        if (href.startsWith('/') && !href.startsWith('//')) {
          return (
            <Link key={index} href={href} className={props.className}>
              {Array.from(node.childNodes).map((child, i) => nodeToReact(child, i))}
            </Link>
          );
        }
      }
      
      // Create element for other tags
      const children = Array.from(node.childNodes).map((child, i) => nodeToReact(child, i));
      
      // Handle self-closing tags
      if (['br', 'hr', 'img', 'input', 'meta', 'link'].includes(tag)) {
        return <>{children}</>;
      }
      
      return <>{children}</>;
    }
    
    const body = doc.body;
    const parsedContent = Array.from(body.childNodes).map((node, i) => nodeToReact(node, i));
    setContent(parsedContent);
  }, [html]);
  
  // Render raw HTML on server, parsed content on client after hydration
  return (
    <div className={className} dangerouslySetInnerHTML={content ? undefined : { __html: html }}>
      {content}
    </div>
  );
}
