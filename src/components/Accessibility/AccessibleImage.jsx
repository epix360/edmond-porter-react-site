import React from 'react';

const AccessibleImage = ({ 
  src, 
  alt, 
  caption, 
  longdesc,
  className = '',
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  mobileWidth = null, // Add mobile-specific width
  mobileHeight = null, // Add mobile-specific height
  mobileSrc = null, // Add mobile-specific source
  ...props 
}) => {
  // Determine if mobile version should be used
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const finalWidth = isMobile && mobileWidth ? mobileWidth : width;
  const finalHeight = isMobile && mobileHeight ? mobileHeight : height;
  const finalSrc = isMobile && mobileSrc ? mobileSrc : src;
  
  return (
    <figure className={`relative ${className}`}>
      <img
        src={finalSrc}
        alt={alt}
        className="w-full h-auto"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        width={finalWidth}
        height={finalHeight}
        fetchpriority={priority ? 'high' : 'auto'}
        {...props}
      />
      {caption && (
        <figcaption className="text-sm text-on-surface-variant mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
      {longdesc && (
        <span className="sr-only" dangerouslySetInnerHTML={{ __html: longdesc }} />
      )}
    </figure>
  );
};

export default AccessibleImage;
