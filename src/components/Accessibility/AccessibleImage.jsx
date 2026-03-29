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
  mobileWidth, // Keep mobile-specific width from props
  mobileHeight, // Keep mobile-specific height from props
  mobileSrc, // Keep mobile-specific source from props
  ...props 
}) => {
  // Determine if mobile version should be used
  const [isMobile, setIsMobile] = React.useState(false);
  
  // Check mobile status on mount and window resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileSrc]);
  
  const finalWidth = isMobile && mobileWidth ? mobileWidth : width;
  const finalHeight = isMobile && mobileHeight ? mobileHeight : height;
  const finalSrc = isMobile && mobileSrc ? mobileSrc : src;
  
  // Debug logging to identify responsive image issues
  if (typeof window !== 'undefined') {
    console.log('🔍 Responsive Image Debug:');
    console.log('- Window width:', window.innerWidth);
    console.log('- Mobile src:', mobileSrc);
    console.log('- Desktop src:', src);
    console.log('- Is mobile detected:', isMobile);
    console.log('- Media query should match:', window.innerWidth <= 768);
  }
  
  return (
    <figure className={`relative ${className}`}>
      <picture>
        {mobileSrc && (
          <source 
            media="(max-width: 768px)" 
            src={mobileSrc}
          />
        )}
        <img
          src={src}
          alt={alt}
          className="h-auto mx-auto block"
          style={{
            maxWidth: '100%',
            height: 'auto'
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          width={width}
          height={height}
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={(event) => {
            if (typeof window !== 'undefined') {
              console.log('🖼️ Image Loaded:');
              console.log('- Current src:', event.target.src);
              console.log('- Natural width:', event.target.naturalWidth);
              console.log('- Natural height:', event.target.naturalHeight);
              console.log('- Display width:', event.target.width);
              console.log('- Display height:', event.target.height);
            }
          }}
          {...props}
        />
      </picture>
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
