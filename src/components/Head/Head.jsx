import React from 'react';
import { Helmet } from 'react-helmet-async';

const Head = ({ 
  title, 
  description, 
  canonicalUrl, 
  ogImage, 
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  children 
}) => {
  const siteTitle = title ? `${title} | Edmond A Porter` : 'Edmond A Porter | Author';
  const siteDescription = description || 'Contemporary author exploring human experience through compelling narratives and thoughtful prose.';
  const siteUrl = 'https://edmondaporter.com';
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="Edmond A Porter" />
      <meta property="og:image" content={ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/images/Edmond_Headshot.webp`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Edmond A Porter - Contemporary Author" />
      
      {/* Twitter Card Meta Tags */}
      {/* <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@edmondporter" />
      <meta name="twitter:creator" content="@edmondporter" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/images/Edmond_Headshot.webp`} />
      <meta name="twitter:image:alt" content="Edmond A Porter - Contemporary Author" /> */}
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Edmond A Porter" />
      <meta name="keywords" content="Edmond Porter, author, writer, contemporary literature, fiction, essays, poetry, novels, Turbulent Waters, The Seasons That Made Me" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en" />
      
   {/* Structured Data */}
{structuredData && (
  <script 
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
  />
)}
      
      {/* Favicon and Theme */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/images/logo192.png" />
      <meta name="theme-color" content="#000000" />
      
      {/* Preload Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {children}
    </Helmet>
  );
};

export default Head;
