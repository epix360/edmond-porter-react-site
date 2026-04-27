import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative ${className}`}
      style={{ 
        // Prevent layout shift with aspect ratio
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        // Set explicit dimensions to prevent CLS
        width: width || '100%',
        height: height || 'auto'
      }}
    >
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          sizes={sizes}
          width={width}
          height={height}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          {...props}
        />
      )}
      
      {hasError && (
        <div className="flex items-center justify-center bg-surface-container-lowest rounded-lg min-h-[200px] text-on-surface-variant">
          <div className="text-center p-4">
            <span className="material-symbols-outlined text-4xl mb-2 block">image_not_supported</span>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      
      {/* Low-quality placeholder for better perceived performance */}
      {!isLoaded && isInView && !hasError && (
        <div 
          className="absolute inset-0 bg-surface-container-highest animate-pulse"
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
