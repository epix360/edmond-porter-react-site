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
  const [currentSrc, setCurrentSrc] = React.useState(src);
  
  // Check mobile status on mount and window resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      setIsMobile(mobile);
      // Force mobile image selection
      if (mobile && mobileSrc) {
        setCurrentSrc(mobileSrc);
      } else {
        setCurrentSrc(src);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [mobileSrc, src]);
  
  return (
    <figure className={`relative ${className}`}>
      <img
        src={currentSrc}
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
            console.log('- Is mobile:', isMobile);
            console.log('- Mobile src available:', !!mobileSrc);
          }
        }}
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
