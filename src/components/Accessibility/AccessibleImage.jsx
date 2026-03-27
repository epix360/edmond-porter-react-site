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
  ...props 
}) => {
  return (
    <figure className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-auto"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        width={width}
        height={height}
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
